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
import { UsersModule } from '../users/users.module';
import { DiscordService } from '../discord/services/discord.service';
import { StaffGuard } from './guards/staff.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: true }),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    DiscordStrategy,
    SessionSerializer,
    DiscordAuthGuard,
    DiscordService,
    AdminGuard,
    StaffGuard,
  ],
  exports: [
    AuthService,
    DiscordAuthGuard,
    AdminGuard,
    StaffGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
