import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../modules/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User | undefined => {
    const { user } = ctx.switchToHttp().getRequest<Request>();
    return user;
  },
);
