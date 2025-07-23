import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: AuthDto) {
    const { email, password } = dto;
    const user = await this.usersService.findByWithPassword(email, 'email');
    if (user && (await user.compare(password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async signin(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async signup(dto: AuthDto) {
    const { email, password } = dto;
    const existingUser = await this.usersService.findByWithPassword(
      email,
      'email',
    );
    if (existingUser)
      throw new BadRequestException('User with this email already exists');

    const user = await this.usersService.create({ email, password });

    return this.signin(user);
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const dbUser = await this.usersService.findByWithPassword(user.id, 'id');

    if (!(await dbUser.compare(changePasswordDto.passwordCurrent)))
      throw new UnauthorizedException('Current password is incorrect');

    await this.usersService.updatePassword(user.id, changePasswordDto.password);
    const updatedUser = await this.usersService.findById(user.id);
    return this.signin(updatedUser);
  }
}
