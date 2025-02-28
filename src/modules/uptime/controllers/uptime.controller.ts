import { Controller, Get } from '@nestjs/common';
import { UptimeService } from '../services/uptime.service';

@Controller('uptime')
export class UptimeController {
    constructor(private readonly uptimeService: UptimeService) {}

    @Get()
    async getUptime() {
        return this.uptimeService.checkUptime();
    }
}
