import { Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { authErrors } from 'src/common/helpers/auth-error.helper';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async login(email: string, password: string) {
    if (email !== 'user@test.com' || password !== '12345') {
      authErrors('Access denied');
    }

    const user = {
      id: 1,
      email,
      role: 'ADMIN',
    };

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
