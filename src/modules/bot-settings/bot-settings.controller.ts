import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { BotSettingsService } from './bot-settings.service';
import { UpdateBotSettingsDto } from './dto/update-bot-settings.dto';
import { DiscordAuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { Request } from 'express';

@Controller('bot-settings')
@UseGuards(DiscordAuthGuard, AdminGuard)
export class BotSettingsController {
    constructor(private readonly botSettingsService: BotSettingsService) {}

    @Get()
    async findAll() {
        return this.botSettingsService.findAll();
    }

    @Patch('update')
    async update(
        @Body() updateBotSettingsDto: UpdateBotSettingsDto,
        @Req() req: Request
    ) {
        const user = req.session.user as any;
        console.log(user,'linha 24');
        return this.botSettingsService.update(
            updateBotSettingsDto,
            user.id,
            user.username,
            user.avatar
        );
    }
} 