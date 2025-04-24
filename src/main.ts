import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import { createDatabase } from './database/create-database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Cria o banco de dados se não existir
  await createDatabase(configService);

  app.use(new LoggingMiddleware().use);

  // Configuração da sessão
  app.use(
    session({
      secret: configService.get('SESSION_SECRET') || 'seu-segredo', // Use uma variável de ambiente
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Defina como `false` no ambiente local
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Ajuste para o ambiente
      },
    }),
  );

  // Configuração do CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Inicialização do Passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();