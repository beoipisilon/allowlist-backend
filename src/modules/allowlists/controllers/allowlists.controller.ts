import { Controller, Get, UseGuards, Post, Body, Req } from '@nestjs/common';
import { AllowlistsService } from '../services/allowlists.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';
import { ApproveAllowlistDto } from '../dto/approve-allowlist.dto';
import { RejectAllowlistDto } from '../dto/reject-allowlist.dto';
import { Request } from 'express';

@Controller('allowlists')
@UseGuards(DiscordAuthGuard)
export class AllowlistsController {
    constructor(private allowlistsService: AllowlistsService) {}

    @Get()
    @RequirePermissions('view_allowlists')
    getAllAllowlists() {
        return this.allowlistsService.getAll();
    }

    @Post('approve')
    @RequirePermissions('approve_allowlists')
    async approve(@Body() dto: ApproveAllowlistDto, @Req() req: Request) {
        return this.allowlistsService.approveAllowlist(dto, req);
    }

    @Post('reject')
    @RequirePermissions('reject_allowlists')
    async reject(@Body() dto: RejectAllowlistDto, @Req() req: Request) {
        return this.allowlistsService.rejectAllowlist(dto, req);
    }
}
