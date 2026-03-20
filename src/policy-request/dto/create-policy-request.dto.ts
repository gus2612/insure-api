import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { StatusEnum } from '../enum/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePolicyRequestDto {
  @ApiProperty({
    example: 'FOL-000123',
    description: 'Folio to policy',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  folio: string;

  @ApiProperty({
    example: 'customer test',
    description: 'Customer name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: 'user@email.com',
    description: 'email to customer',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({
    example: 'product test',
    description: 'Name to product',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  product: string;

  @ApiProperty({
    example: 12333,
    description: 'amount',
    required: false,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'The amount must be a valid number' })
  @IsPositive({ message: 'The insured amount must be greater than 0' })
  insuredAmount: number;

  @ApiProperty({
    example: 'PENDING',
    description: 'status to policy',
    required: false,
  })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;
}
