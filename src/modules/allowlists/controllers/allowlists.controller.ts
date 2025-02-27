import { Controller, Get, UseGuards, Post, Body, Req } from '@nestjs/common';
import { AllowlistsService } from '../services/allowlists.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { ApproveAllowlistDto } from '../dto/approve-allowlist.dto';
import { RejectAllowlistDto } from '../dto/reject-allowlist.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Request } from 'express';

@Controller('allowlists')
export class AllowlistsController {
    constructor(private allowlistsService: AllowlistsService) {}

    @Get()
    @UseGuards(DiscordAuthGuard, AdminGuard) 
    getAllAllowlists() {
        return this.allowlistsService.getAll();
    }

    @Post('approve')
    @UseGuards(DiscordAuthGuard, AdminGuard) 
    async approve(@Body() dto: ApproveAllowlistDto, @Req() req: Request) {
        return this.allowlistsService.approveAllowlist(dto, req);
    }

    @Post('reject')
    @UseGuards(DiscordAuthGuard, AdminGuard)
    async reject(@Body() dto: RejectAllowlistDto, @Req() req: Request) {
        return this.allowlistsService.rejectAllowlist(dto, req);
    }
}
