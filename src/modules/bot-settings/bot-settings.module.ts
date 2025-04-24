import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotSettingsController } from './bot-settings.controller';
import { BotSettingsService } from './bot-settings.service';
import { BotSettings } from './entities/bot-settings.entity';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BotSettings]),
    forwardRef(() => AuthModule),
    AuditModule,
    DiscordModule
  ],
  controllers: [BotSettingsController],
  providers: [BotSettingsService],
  exports: [BotSettingsService]
})
export class BotSettingsModule {} 