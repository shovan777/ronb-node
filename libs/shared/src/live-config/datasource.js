'use strict';
exports.__esModule = true;
var typeorm_1 = require('typeorm');
require('dotenv').config();
var AppDataSource = new typeorm_1.DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/libs/**/*.entity{.ts,.js}'],
  migrations: ['dist/libs/shared/live-migrations/*{.ts,.js}'],
});
exports['default'] = AppDataSource;
