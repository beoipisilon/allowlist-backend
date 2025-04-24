import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allowlist } from '../../allowlists/entities/allowlists.entity';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { UptimeService } from '../../uptime/services/uptime.service';
import * as moment from 'moment';

@Injectable()
export class DashboardService {
    private readonly logger = new Logger(DashboardService.name);

    constructor(
        @InjectRepository(Allowlist)
        private readonly allowlistRepository: Repository<Allowlist>,
        @InjectRepository(AuditLog)
        private readonly auditLogRepository: Repository<AuditLog>,
        private readonly uptimeService: UptimeService,
    ) {}

    async getDashboardData() {
        try {
            const allowlists = await this.allowlistRepository.find();

            const today = moment().startOf('day');
            const lastWeek = moment().subtract(1, 'week').startOf('day');

            const stats = {
                pending: allowlists.filter((item) => item.status === 'pending').length,
                approved: allowlists.filter((item) => item.status === 'approved').length,
                rejected: allowlists.filter((item) => item.status === 'rejected').length,
            };

            const countChanges = (status: string, since: moment.Moment) => {
                return allowlists.filter(
                    (item) => item.status === status && moment(item.updatedAt).isAfter(since)
                ).length;
            };

            const todayPending = countChanges('pending', today);
            const todayApproved = countChanges('approved', today);
            const todayRejected = countChanges('rejected', today);

            const weekPending = countChanges('pending', lastWeek);
            const weekApproved = countChanges('approved', lastWeek);
            const weekRejected = countChanges('rejected', lastWeek);

            // Get recent activities from audit logs
            const recentActivity = await this.auditLogRepository.find({
                order: { createdAt: 'DESC' },
                take: 3,
            });

            const formattedRecentActivity = recentActivity.map((item) => ({
                user: item.username,
                action: item.actionType,
                target: item.resourceType || 'Sistema',
                time: this.formatTimeDifference(item.createdAt),
            }));

            const uptimeStatus = await this.uptimeService.checkUptime();

            return {
                stats,
                recentActivity: formattedRecentActivity,
                status: {
                    bot: 'Online',
                    api: uptimeStatus.responseTime,
                    uptime: uptimeStatus.uptime,
                },
                statsChanges: {
                    pending: {
                        today: `${todayPending} hoje`,
                        week: `${weekPending} esta semana`,
                    },
                    approved: {
                        today: `${todayApproved} hoje`,
                        week: `${weekApproved} esta semana`,
                    },
                    rejected: {
                        today: `${todayRejected} hoje`,
                        week: `${weekRejected} esta semana`,
                    },
                },
            };
        } catch (error) {
            this.logger.error(`Error fetching dashboard data: ${error.message}`);
            throw new Error('Failed to fetch dashboard data');
        }
    }

    // Função para formatar a diferença de tempo
    private formatTimeDifference(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `há ${diffInSeconds} segundos`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `há ${hours} hora${hours > 1 ? 's' : ''}`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `há ${days} dia${days > 1 ? 's' : ''}`;
        }
    }
}
