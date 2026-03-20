import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from '../enum/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FiltersPolicyRequestDto {
  @ApiProperty({
    description: 'Filter to costumer name.',
    type: String,
    required: false,
    example: 'Customer test name',
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Filter to status name.',
    type: String,
    required: false,
    example: 'PENDING',
  })
  @IsEnum(StatusEnum)
  @IsString()
  @IsOptional()
  status?: StatusEnum;

  @ApiProperty({
    description: 'Page to paginate',
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Limit to paginate',
    type: Number,
    required: false,
    example: 10,
  })
  @IsOptional()
  limit?: number;
}
