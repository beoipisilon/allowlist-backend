import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const createDataSource = async (configService: ConfigService) => {
  const dataSource = new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', ''),
    database: configService.get('DB_DATABASE', 'cfxre'),
    charset: 'utf8mb4',
    logging: true,
    synchronize: configService.get('NODE_ENV') !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
  });

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');
    return dataSource;
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
}; 