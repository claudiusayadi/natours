import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import pkg from '../package.json';
import { AppModule } from './app.module';
import { PackageJson } from './common/interfaces/pkg.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const api_prefix = config.get<string>('API_PREFIX')!;
  const port = config.get<string>('PORT')!;
  const env = config.get<string>('NODE_ENV')!;

  const p: PackageJson = pkg as PackageJson;

  const title: string = p?.title?.replace(/-/g, ' ').toUpperCase() ?? '';

  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix(api_prefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (config.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(title)
      .setDescription(p?.description ?? '')
      .setVersion(p?.version ?? '2.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      // .addTag('auth', 'Authentication endpoints')
      // .addTag('users', 'User management endpoints')
      // .addTag('tours', 'Tour management endpoints')
      // .addTag('reviews', 'Review management endpoints')
      // .addTag('bookings', 'Booking management endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${api_prefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log('📚 Swagger documentation available at /api/docs');
  }

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`🌍 Environment: ${env}`);
}

bootstrap();
