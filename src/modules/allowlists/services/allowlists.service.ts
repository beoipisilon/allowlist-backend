// src/allowlists/allowlists.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allowlist } from '../entities/allowlists.entity';
import { DiscordService } from '../../discord/services/discord.service';
import { ApproveAllowlistDto } from '../dto/approve-allowlist.dto';
import { RejectAllowlistDto } from '../dto/reject-allowlist.dto';
import { AuditService } from '../../audit/services/audit.service';
import { Request } from 'express';

@Injectable()
export class AllowlistsService {
    constructor(
        @InjectRepository(Allowlist)
        private allowlistsRepository: Repository<Allowlist>,
        private readonly discordService: DiscordService,
        private readonly auditService: AuditService,
    ) {}

    async getAll() {
        const allowlists = await this.allowlistsRepository.find({where: {status: 'pending'}});
        const allowlistsWithDetails = await Promise.all(
            allowlists.map(async (allowlist) => {
                const username = await this.discordService.getUsername(allowlist.userId);
                const avatarUrl = await this.discordService.getAvatarUrl(allowlist.userId);
                return {
                ...allowlist,
                username,
                avatarUrl,
                };
            }),
        );

        return allowlistsWithDetails;
    }

    async approveAllowlist(dto: ApproveAllowlistDto, req: Request): Promise<Allowlist> {
        const allowlist = await this.allowlistsRepository.findOne({
            where: { userId: dto.userId },
        });

        if (!allowlist) {
            throw new NotFoundException('Allowlist não encontrada');
        }

        allowlist.status = 'approved';
        allowlist.updatedAt = new Date();
        const loggedUserName = req.session.user?.username;
        const userId = req.session.user?.id;
        const userAvatar = req.session.user?.avatar;
        const username = await this.discordService.getUsername(allowlist.userId);

        // Log na tabela de auditoria
        await this.auditService.logApprove(
            userId,
            loggedUserName,
            userAvatar,
            'allowlist',
            allowlist.id.toString(),
            `Aprovou a whitelist #${allowlist.id} de ${username}`
        );

        if (process.env.DISCORD_GUILD_ID && process.env.DISCORD_ROLE_APPROVED_ID) {
            await this.discordService.addRole(allowlist.userId, process.env.DISCORD_GUILD_ID, process.env.DISCORD_ROLE_APPROVED_ID);
        }

        console.log(process.env.CHANNEL_LOGSWHITELIST,'linha 65')

        if (process.env.CHANNEL_LOGSWHITELIST) {
            await this.discordService.sendText(process.env.CHANNEL_LOGSWHITELIST, `Parabéns <@${allowlist.userId}> Você foi aprovado na Allowlist.`);
        }

        return this.allowlistsRepository.save(allowlist);
    }

    async rejectAllowlist(dto: RejectAllowlistDto, req: Request): Promise<Allowlist> {
        const allowlist = await this.allowlistsRepository.findOne({
            where: { userId: dto.userId },
        });

        if (!allowlist) {
            throw new NotFoundException('Allowlist não encontrada');
        }

        allowlist.status = 'rejected';
        allowlist.updatedAt = new Date();
        const loggedUserName = req.session.user?.username;
        const userId = req.session.user?.id;
        const userAvatar = req.session.user?.avatar;
        const username = await this.discordService.getUsername(allowlist.userId);

        // Log na tabela de auditoria
        await this.auditService.logUpdate(
            userId,
            loggedUserName,
            userAvatar,
            'allowlist',
            allowlist.id.toString(),
            `Rejeitou a whitelist #${allowlist.id} de ${username}`
        );

        console.log(process.env.CHANNEL_LOGSWHITELIST,'linha 81')
        if (process.env.CHANNEL_LOGSWHITELIST) {
            await this.discordService.sendText(process.env.CHANNEL_LOGSWHITELIST, `Olá <@${allowlist.userId}> Você foi Reprovado na Allowlist.`);
        }

        return this.allowlistsRepository.save(allowlist);
    }
}