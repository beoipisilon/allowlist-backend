import { AuditActionType } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  userId: string;
  username: string;
  avatar: string;
  actionType: AuditActionType;
  action: string;
  details: string;
  resourceId?: string;
  resourceType?: string;
  metadata?: Record<string, any>;
}

export class AuditLogDto {
  id: number;
  userId: string;
  username: string;
  avatar: string;
  actionType: AuditActionType;
  action: string;
  details: string;
  resourceId?: string;
  resourceType?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class AuditLogQueryDto {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
} 