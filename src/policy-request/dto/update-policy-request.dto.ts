import { PartialType } from '@nestjs/mapped-types';
import { CreatePolicyRequestDto } from './create-policy-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusEnum } from '../enum/status.enum';

export class UpdatePolicyRequestDto extends PartialType(
  CreatePolicyRequestDto,
) {
  @ApiProperty({
    example: 'PENDING',
    description: 'status to policy',
    required: false,
  })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;
}
