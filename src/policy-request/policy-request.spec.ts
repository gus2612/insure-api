import { Test, TestingModule } from '@nestjs/testing';
import { PolicyRequestService } from './policy-request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PolicyRequest } from './entities/policy-request.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/common/redis/redis.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StatusEnum } from './enum/status.enum';

describe('PolicyRequestService', () => {
  let service: PolicyRequestService;
  let repository: jest.Mocked<Repository<PolicyRequest>>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyRequestService,
        {
          provide: getRepositoryToken(PolicyRequest),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PolicyRequestService>(PolicyRequestService);
    repository = module.get(getRepositoryToken(PolicyRequest));
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================
  it('should create a policy request', async () => {
    const dto: any = { customerName: 'John' };
    const entity = { id: 1, ...dto };

    repository.create.mockReturnValue(entity as any);
    repository.save.mockResolvedValue(entity as any);

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalled();
    expect(result.data).toEqual(entity);
  });

  // =========================
  // FIND ALL (CACHE HIT)
  // =========================
  it('should return cached data if exists', async () => {
    const filters: any = { page: 1 };
    const cachedResponse = { data: [], pagination: {} };

    redisService.get.mockResolvedValue(cachedResponse);

    const result = await service.findAll(filters);

    expect(redisService.get).toHaveBeenCalled();
    expect(repository.findAndCount).not.toHaveBeenCalled();
    expect(result).toEqual(cachedResponse);
  });

  // =========================
  // FIND ALL (DB QUERY)
  // =========================
  it('should return data from DB and save in cache', async () => {
    const filters: any = { page: 1, limit: 10 };
    const dbResponse = [[{ id: 1 }], 1];

    redisService.get.mockResolvedValue(null);
    repository.findAndCount.mockResolvedValue(dbResponse as any);

    const result = await service.findAll(filters);

    expect(repository.findAndCount).toHaveBeenCalled();
    expect(redisService.set).toHaveBeenCalled();
    expect(result.data.length).toBe(1);
  });

  // =========================
  // FIND ONE SUCCESS
  // =========================
  it('should return a policy request', async () => {
    const policy = { id: 1 };

    repository.findOneBy.mockResolvedValue(policy as any);

    const result = await service.findOne(1);

    expect(result.data).toEqual(policy);
  });

  // =========================
  // FIND ONE NOT FOUND
  // =========================
  it('should throw NotFoundException if policy not exists', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  // =========================
  // UPDATE SUCCESS
  // =========================
  it('should update policy status', async () => {
    const policy = { data: { status: 'PENDING' } };

    jest.spyOn(service, 'findOne').mockResolvedValue(policy as any);
    repository.update.mockResolvedValue({} as any);

    const result = await service.update(1, { status: StatusEnum.ISSUED });

    expect(repository.update).toHaveBeenCalledWith(1, {
      status: 'ISSUED',
    });
    expect(result.message).toContain('updated');
  });

  // =========================
  // UPDATE INVALID TRANSITION
  // =========================
  it('should throw error if status changes from ISSUED to PENDING', async () => {
    const policy = { data: { status: 'ISSUED' } };

    jest.spyOn(service, 'findOne').mockResolvedValue(policy as any);

    await expect(
      service.update(1, { status: StatusEnum.PENDING }),
    ).rejects.toThrow(BadRequestException);
  });
});