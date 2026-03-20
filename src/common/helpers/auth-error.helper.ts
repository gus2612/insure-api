import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

export const authErrors = (error: any): never => {
  if (error == 'Access denied') {
    throw new UnauthorizedException('Invalid credentials');
  }

  throw new InternalServerErrorException('error undefined');
};