import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/common/interfaces/payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: Payload) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.active)
      throw new UnauthorizedException('User not found or inactive');

    if (user.changedPasswordAfter(payload.iat))
      throw new UnauthorizedException(
        'User recently changed password! Please log in again.',
      );

    return user;
  }
}
