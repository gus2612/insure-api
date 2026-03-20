import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

export const handleDBErrors = (error: any): never => {
  if (error.number === 2627 || error.number === 2601) {
    throw new BadRequestException('This folio alredy exist');
  }

  throw new InternalServerErrorException('error not found verify');
};