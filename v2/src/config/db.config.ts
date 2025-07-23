import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import { Booking } from '../modules/bookings/entities/booking.entity';
import { Review } from '../modules/reviews/entities/review.entity';
import { Tour } from '../modules/tours/entities/tour.entity';
import { User } from '../modules/users/entities/user.entity';
import { ApiConfig } from './env.validation';

export const createDataSource = () => {
  const dbOptions = {
    type: 'postgres',
    host: ApiConfig.DB_HOST,
    port: ApiConfig.DB_PORT,
    username: ApiConfig.DB_USERNAME,
    password: encodeURIComponent(ApiConfig.DB_PASSWORD),
    database: ApiConfig.DB_NAME,
    entities: [User, Tour, Review, Booking],
    migrations: ['src/db/migrations/*.ts'],
    synchronize: ApiConfig.NODE_ENV === 'development',
    logging: false,
  };

  return dbOptions as DataSourceOptions & TypeOrmModuleOptions;
};

export const AppDataSource = new DataSource(createDataSource());
