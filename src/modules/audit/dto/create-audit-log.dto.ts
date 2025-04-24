import { IsString, IsEnum, IsOptional } from 'class-validator';
import { AuditActionType } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsString()
  avatar: string;

  @IsEnum(AuditActionType)
  actionType: AuditActionType;

  @IsString()
  details: string;

  @IsString()
  @IsOptional()
  resourceType?: string;

  @IsString()
  @IsOptional()
  resourceId?: string;

  @IsString()
  @IsOptional()
  oldData?: string;

  @IsString()
  @IsOptional()
  newData?: string;
} 