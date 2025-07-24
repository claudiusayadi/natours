import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tour } from '../tours/entities/tour.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepo: Repository<Booking>,
    @InjectRepository(Tour)
    private readonly toursRepo: Repository<Tour>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateBookingDto, userId?: string): Promise<Booking> {
    const finalUserId = userId || dto.userId;

    if (!finalUserId)
      throw new UnprocessableEntityException('User ID is required');

    // Verify tour exists
    const tour = await this.toursRepo.findOne({
      where: { id: dto.tourId },
    });
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${dto.tourId} not found`);
    }

    // Verify user exists
    const user = await this.usersRepo.findOne({
      where: { id: finalUserId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${finalUserId} not found`);
    }

    const booking = this.bookingsRepo.create({
      ...dto,
      userId: finalUserId,
    });

    return this.bookingsRepo.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepo.find({
      relations: ['user', 'tour'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookingsRepo.find({
      where: { userId },
      relations: { tour: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingsRepo.findOneOrFail({
      where: { id },
      relations: { user: true, tour: true },
    });

    if (!booking)
      throw new NotFoundException(`Booking with ID ${id} not found`);

    return booking;
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    await this.bookingsRepo.update(id, dto);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookingsRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Booking with ID ${id} not found`);
  }

  async hasUserBookedTour(userId: string, tourId: string): Promise<boolean> {
    const booking = await this.bookingsRepo.findOne({
      where: { userId, tourId, paid: true },
    });

    return !!booking;
  }

  async createCheckoutSession(tourId: string, userId: string): Promise<any> {
    const tour = await this.toursRepo.findOne({ where: { id: tourId } });
    if (!tour) throw new NotFoundException(`Tour with ID ${tourId} not found`);

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    // @TODO: Integrate with Stripe or payment provider
    return {
      id: `cs_${Date.now()}`,
      url: `${this.config.get('FRONTEND_URL')}/checkout?session_id=cs_${Date.now()}`,
      tour: {
        id: tour.id,
        name: tour.name,
        price: tour.price,
      },
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
