import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { AuthModule } from '../auth/auth.module';
import { DiscordModule } from '../discord/discord.module';
import { BotSettingsModule } from '../bot-settings/bot-settings.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    DiscordModule,
    forwardRef(() => AuthModule),
    BotSettingsModule,
    AuditModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}