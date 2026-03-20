import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { handleDBErrors } from 'src/common/helpers/db-error.helper';
import { PolicyRequest } from './entities/policy-request.entity';
import { CreatePolicyRequestDto } from './dto/create-policy-request.dto';
import { UpdatePolicyRequestDto } from './dto/update-policy-request.dto';
import { FiltersPolicyRequestDto } from './dto/filters-policy-request.dto';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class PolicyRequestService {
  private readonly logger = new Logger(PolicyRequest.name);

  constructor(
    @InjectRepository(PolicyRequest)
    private policyRequestRepository: Repository<PolicyRequest>,
    private readonly redisService: RedisService,
  ) {}

  async create(createPolicyRequestDto: CreatePolicyRequestDto) {
    try {
      this.logger.log('create PolicyRequest starting...');
      //Create entity to save in DB
      const entity = this.policyRequestRepository.create(
        createPolicyRequestDto,
      );
      // implement save information to DB
      const createRequest = await this.policyRequestRepository.save(entity);

      this.logger.log('create PolicyRequest ending...');
      // Return create data
      return {
        message: 'policy create success',
        data: createRequest,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      handleDBErrors(error);
    }
  }

  async findAll(filters: FiltersPolicyRequestDto) {
    try {
      this.logger.log('findAll PolicyRequest starting...');
      const cacheKey = `policyRequests:${JSON.stringify(filters)}`;

      const cached = await this.redisService.get(cacheKey);

      if (cached) {
        this.logger.log('Redis information retrieved successfully');
        return cached;
      }

      let where: FindOptionsWhere<PolicyRequest>[] = [];
      //Generate filter to customer name and folio
      if (filters.customerName) {
        where = [
          {
            customerName: Like(`%${filters.customerName}%`),
            ...(filters.status && { status: filters.status }),
          },
          {
            folio: Like(`%${filters.customerName}%`),
            ...(filters.status && { status: filters.status }),
          },
        ];
      } else {
        // If the search is normal generate filter individual
        const baseWhere: FindOptionsWhere<PolicyRequest> = {};

        if (filters.status) {
          baseWhere.status = filters.status;
        }

        where = [baseWhere];
      }

      //Pagination
      const page =
        Number(filters.page) && Number(filters.page) > 0
          ? Number(filters.page)
          : 1;
      const limit =
        Number(filters.limit) && Number(filters.limit) > 0
          ? Number(filters.limit)
          : 10;
      const skip = (page - 1) * limit;
      const [data, total] = await this.policyRequestRepository.findAndCount({
        where,
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      });

      const response = {
        message: 'Policy requests retrieved successfully',
        data: data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };

      await this.redisService.set(cacheKey, response, 60);
      this.logger.log('information retrieved successfully');
      return response;
    } catch (error) {
      this.logger.error('Error findAll policy Request');
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      handleDBErrors(error);
    }
  }

  async findOne(id: number) {
    try {
      this.logger.log('findOne PolicyRequest starting...');
      // Find policy Requet by id
      const findPolicyById = await this.policyRequestRepository.findOneBy({
        id,
      });

      // Vaalidate if exist policy Request
      if (!findPolicyById) {
        throw new NotFoundException('Policy request not found');
      }

      //Return information
      this.logger.log('findOne PolicyRequest ending...');
      return {
        message: 'Policy request found successfully',
        data: findPolicyById,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      handleDBErrors(error);
    }
  }

  async update(id: number, updatePolicyRequestDto: UpdatePolicyRequestDto) {
    try {
      this.logger.log('update status PolicyRequest starting...');
      //Find policy request by find one to validate
      const policy = await this.findOne(id);

      //If policy is not exist return exeception not found
      if (!policy) {
        throw new NotFoundException('Policy request not found');
      }

      //Asignate current status in the DB
      const currentStatus = policy.data.status;

      //Asignate new status to update
      const newStatus = updatePolicyRequestDto.status;

      //Validate if curret status is issued and new status is pending return exception
      if (currentStatus === 'ISSUED' && newStatus === 'PENDING') {
        throw new BadRequestException(
          'Cannot change status from ISSUED to PENDING',
        );
      }

      //Update policy request
      await this.policyRequestRepository.update(id, { status: newStatus });
      this.logger.log('update status PolicyRequest ending...');
      return {
        message: 'Policy request updated successfully',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      handleDBErrors(error);
    }
  }
}
