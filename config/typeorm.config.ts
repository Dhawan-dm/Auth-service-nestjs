import { DataSource } from 'typeorm';

require('dotenv').config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: ['src/**/**/*.entity.ts'],
  migrations: ['migrations/*{.ts,.js}'],
});
