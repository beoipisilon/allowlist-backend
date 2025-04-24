import { Controller, Get, UseGuards } from '@nestjs/common';
import { DiscordService } from '../services/discord.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';

@Controller('bot')
@UseGuards(DiscordAuthGuard)
export class DiscordController {
    constructor(private readonly discordService: DiscordService) {}

    @Get('info')
    @RequirePermissions('view_bot_info')
    async getBotInfo() {
        return this.discordService.getBotInfo();
    }
} 