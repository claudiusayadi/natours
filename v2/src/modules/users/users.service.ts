import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepo.create(dto);
    return this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({
      where: { active: true },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOneOrFail({
      where: { id, active: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByWithPassword(
    identifier: string,
    name: 'id' | 'email',
  ): Promise<User | null> {
    const where =
      name === 'id'
        ? { id: identifier, active: true }
        : { email: identifier, active: true };

    const user = await this.usersRepo.findOne({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        role: true,
        photo: true,
        passwordChangedAt: true,
        active: true,
      },
    });

    return user ?? null;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.usersRepo.update(id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      photo: dto.photo,
      role: dto.role,
    });

    return this.findById(id);
  }

  async updatePassword(id: string, password: string): Promise<void> {
    await this.usersRepo.update(id, {
      password,
      passwordChangedAt: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepo.update(id, { active: false });
  }

  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepo.delete(user.id);
  }
}
