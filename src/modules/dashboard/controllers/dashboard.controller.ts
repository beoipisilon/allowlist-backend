import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @UseGuards(DiscordAuthGuard)
    async getDashboardData() {
        return this.dashboardService.getDashboardData();
    }
}