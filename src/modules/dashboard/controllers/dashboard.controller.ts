import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';

@Controller('dashboard')
@UseGuards(DiscordAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get()
    @RequirePermissions('view_dashboard')
    async getDashboardData() {
        return this.dashboardService.getDashboardData();
    }
}