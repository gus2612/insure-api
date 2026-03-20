import { Test, TestingModule } from '@nestjs/testing';
import { PolicyRequest } from './entities/policy-request.entity';
import { PolicyRequestService } from './policy-request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisService } from 'src/common/redis/redis.service';

describe('PolicyRequest', () => {
  let controller: PolicyRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyRequest],
      providers: [
        PolicyRequestService,
        {
          provide: getRepositoryToken(PolicyRequest),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PolicyRequest>(PolicyRequest);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
