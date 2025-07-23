import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDataSource } from 'src/config/db.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: createDataSource,
      inject: [],
    }),
  ],
})
export class DbModule {}
