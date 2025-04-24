// src/discord/discord.module.ts
import { Module } from '@nestjs/common';
import { DiscordService } from './services/discord.service';
import { DiscordController } from './controllers/discord.controller';

@Module({
    providers: [DiscordService],
    exports: [DiscordService],
    controllers: [DiscordController],
})
export class DiscordModule {}