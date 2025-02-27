import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { DiscordStrategy } from './strategies/auth.strategy';
import { ConfigModule } from '@nestjs/config';
import { SessionSerializer } from './strategies/session.serializer';
import { DiscordAuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersDashboard } from '../users/entities/users.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([UsersDashboard]),
    forwardRef(() => UsersModule),  // Resolve a dependência circular
  ],
  providers: [
    AuthService,
    DiscordStrategy,
    SessionSerializer,
    DiscordAuthGuard,
    AdminGuard,
  ],
  exports: [
    AuthService,
    DiscordAuthGuard,
    AdminGuard,
  //  UsersService,  // Não é necessário adicionar aqui, pois já é exportado de UsersModule
    TypeOrmModule.forFeature([UsersDashboard]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
