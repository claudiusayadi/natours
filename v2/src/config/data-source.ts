import { DataSource } from 'typeorm';
import { ApiConfig } from './env.validation';

export default new DataSource({
  type: 'postgres',
  url: ApiConfig.DB_URL,
  entities: ['dist/src/modules/**/*.entity.js'],
  migrations: ['dist/src/db/migrations/*.js'],
});
