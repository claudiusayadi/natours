import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Booking } from '../modules/bookings/entities/booking.entity';
import { Review } from '../modules/reviews/entities/review.entity';
import { Tour } from '../modules/tours/entities/tour.entity';
import { User } from '../modules/users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  entities: [User, Tour, Review, Booking],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: false,
});
