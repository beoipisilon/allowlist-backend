import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { DiscordAuthGuard } from '../auth/guards/auth.guard';
import { RequirePermissions } from '../permissions/decorators/require-permissions.decorator';
import { AuditLogQueryDto } from './dto/audit-log.dto';

@Controller('audit')
@UseGuards(DiscordAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @RequirePermissions('view_audit')
  async getLogs(@Query() query: AuditLogQueryDto) {
    return this.auditService.findAll(query);
  }
} 