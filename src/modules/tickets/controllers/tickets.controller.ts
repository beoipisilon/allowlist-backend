import { Controller, Get, UseGuards, Post, Body, Req } from '@nestjs/common';
import { TicketsService } from '../services/tickets.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { StaffGuard } from '../../auth/guards/staff.guard';
import { GenerateUnlockCodeDto } from '../dto/generate-unlock-code.dto';
import { Request } from 'express';

@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) {}

    @Get()
    @UseGuards(DiscordAuthGuard, StaffGuard) 
    getAllTickets() {
        console.log('getAllTickets');
        return this.ticketsService.getAll();
    }

    @Post('generate-unlock-code')
    @UseGuards(DiscordAuthGuard, StaffGuard)
    generateToken(@Body() dto: GenerateUnlockCodeDto, @Req() req: Request) {
        return this.ticketsService.generateToken(dto, req);
    }
}