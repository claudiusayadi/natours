import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class AuthDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
