// /surgue-backend/src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    provider: string,
    providerId: string,
    displayName: string,
  ): Promise<User> {
    return this.userService.findOrCreate(provider, providerId, displayName);
  }

  login(user: User) {
    const payload = { displayName: user.display_name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
