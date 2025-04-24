import { Module } from '@nestjs/common';
import { Allowlist } from '../allowlists/entities/allowlists.entity';
import { DashboardController } from './controllers/dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './services/dashboard.service';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { UptimeService } from '../uptime/services/uptime.service';

@Module({
    imports: [TypeOrmModule.forFeature([Allowlist, AuditLog, UptimeService])],
    controllers: [DashboardController],
    providers: [DashboardService, UptimeService], 
    exports: [DashboardService], 
})
export class DashboardModule {}
