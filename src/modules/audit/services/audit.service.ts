import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditActionType } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { UpdateAuditLogDto } from '../dto/update-audit-log.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create(createAuditLogDto);
    return this.auditLogRepository.save(auditLog);
  }

  async findAll(query: {
    search?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ logs: AuditLog[]; total: number; page: number; limit: number }> {
    const { search, type, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit_log');

    if (search) {
      queryBuilder.andWhere(
        '(audit_log.username LIKE :search OR audit_log.details LIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (type) {
      queryBuilder.andWhere('audit_log.actionType = :type', { type });
    }

    const [logs, total] = await queryBuilder
      .orderBy('audit_log.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { logs, total, page, limit };
  }

  async findOne(id: number): Promise<AuditLog | null> {
    return this.auditLogRepository.findOne({ where: { id } });
  }

  async update(id: number, updateAuditLogDto: UpdateAuditLogDto): Promise<AuditLog> {
    await this.auditLogRepository.update(id, updateAuditLogDto);
    const updatedLog = await this.findOne(id);
    if (!updatedLog) {
      throw new Error('Audit log not found');
    }
    return updatedLog;
  }

  async remove(id: number): Promise<void> {
    await this.auditLogRepository.delete(id);
  }

  // Métodos específicos para logging
  async logCreate(
    userId: string,
    username: string,
    avatar: string,
    resourceType: string,
    resourceId: string,
    details: string,
    newData?: string
  ): Promise<AuditLog> {
    return this.create({
      userId,
      username,
      avatar,
      actionType: AuditActionType.CREATE,
      resourceType,
      resourceId,
      details,
      newData
    });
  }

  async logUpdate(
    userId: string,
    username: string,
    avatar: string,
    resourceType: string,
    resourceId: string,
    details: string,
    oldData?: string,
    newData?: string
  ): Promise<AuditLog> {
    return this.create({
      userId,
      username,
      avatar,
      actionType: AuditActionType.UPDATE,
      resourceType,
      resourceId,
      details,
      oldData,
      newData
    });
  }

  async logDelete(
    userId: string,
    username: string,
    avatar: string,
    resourceType: string,
    resourceId: string,
    details: string,
    oldData?: string
  ): Promise<AuditLog> {
    return this.create({
      userId,
      username,
      avatar,
      actionType: AuditActionType.DELETE,
      resourceType,
      resourceId,
      details,
      oldData
    });
  }

  async logView(
    userId: string,
    username: string,
    avatar: string,
    resourceType: string,
    resourceId: string,
    details: string
  ): Promise<AuditLog> {
    return this.create({
      userId,
      username,
      avatar,
      actionType: AuditActionType.VIEW,
      resourceType,
      resourceId,
      details
    });
  }

  async logPermission(
    userId: string,
    username: string,
    avatar: string,
    resourceType: string,
    resourceId: string,
    details: string
  ): Promise<AuditLog> {
    return this.create({
      userId,
      username,
      avatar,
      actionType: AuditActionType.PERMISSION,
      resourceType,
      resourceId,
      details
    });
  }

  async logApprove(
    userId: string,
    username: string,
    avatar: string,
    resourceType: string,
    resourceId: string,
    details: string
  ): Promise<AuditLog> {
    return this.create({
      userId,
      username,
      avatar,
      actionType: AuditActionType.APPROVE,
      resourceType,
      resourceId,
      details
    });
  }

  async findAllLogs() {
    return this.auditLogRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByUserId(userId: string) {
    return this.auditLogRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByResourceId(resourceId: string) {
    return this.auditLogRepository.find({
      where: { resourceId },
      order: {
        createdAt: 'DESC',
      },
    });
  }
} 