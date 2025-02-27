import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
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
    origin: configService.get('FRONTEND_URL') || 'http://localhost:8080', // Front-end
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Inicialização do Passport
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}
bootstrap();