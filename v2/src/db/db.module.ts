import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DB_URL'),
        entities: ['dist/src/modules/**/*.entity{.ts,.js}'],
        migrations: ['src/db/migrations/*.ts'],
        synchronize: config.get('NODE_ENV') === 'development',
        logging: false,
      }),
    }),
  ],
})
export class DbModule {}
