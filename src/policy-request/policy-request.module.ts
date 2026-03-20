import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyRequest } from './entities/policy-request.entity';
import { PolicyRequestController } from './policy-request.controller';
import { PolicyRequestService } from './policy-request.service';
import { CommonModule } from 'src/common/common.module';


@Module({
  imports: [TypeOrmModule.forFeature([PolicyRequest]), CommonModule],
  controllers: [PolicyRequestController],
  providers: [PolicyRequestService],
})
export class PolicyRequestModule {}
