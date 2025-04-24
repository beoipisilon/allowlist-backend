import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const createDatabase = async (configService: ConfigService) => {
  const dataSource = new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', ''),
    database: 'mysql', // Conecta ao banco de dados padrão do MySQL
    charset: 'utf8mb4',
    logging: true,
  });

  try {
    await dataSource.initialize();
    const databaseName = configService.get('DB_DATABASE', 'cfxre');
    
    // Verifica se o banco de dados existe
    const result = await dataSource.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [databaseName]);
    
    if (result.length === 0) {
      // Cria o banco de dados se não existir
      await dataSource.query(`CREATE DATABASE ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`Database ${databaseName} created successfully!`);
    } else {
      console.log(`Database ${databaseName} already exists.`);
    }

    await dataSource.destroy();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}; 