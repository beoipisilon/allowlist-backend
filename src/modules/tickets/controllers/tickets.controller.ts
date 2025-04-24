import { Controller, Get, UseGuards, Post, Body, Req } from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';
import { StaffGuard } from '../../auth/guards/staff.guard';
import { GenerateUnlockCodeDto } from '../dto/generate-unlock-code.dto';
import { Request } from 'express';

@Controller('tickets')
@UseGuards(DiscordAuthGuard)
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}

    @Get()
    @RequirePermissions('view_tickets')
    getAllTickets() {
        console.log('getAllTickets');
        return this.ticketsService.getAll();
    }

    @Post('generate-unlock-code')
    @RequirePermissions('manage_tickets')
    generateToken(@Body() dto: GenerateUnlockCodeDto, @Req() req: Request) {
        return this.ticketsService.generateToken(dto, req);
    }
}