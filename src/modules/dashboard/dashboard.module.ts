import { Module } from '@nestjs/common';
import { Allowlist } from '../allowlists/entities/allowlists.entity';
import { DashboardController } from './controllers/dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './services/dashboard.service';
import { Action } from '../actions/entities/actions.entity';
import { UptimeService } from '../api-status/services/api-status.service';

@Module({
    imports: [TypeOrmModule.forFeature([Allowlist, Action, UptimeService])],
    controllers: [DashboardController],
    providers: [DashboardService, UptimeService], 
    exports: [DashboardService], 
})
export class DashboardModule {}
