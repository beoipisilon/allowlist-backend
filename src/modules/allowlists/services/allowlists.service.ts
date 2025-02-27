// src/allowlists/allowlists.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Allowlist } from '../entities/allowlists.entity';
import { DiscordService } from '../../discord/services/discord.service';
import { ApproveAllowlistDto } from '../dto/approve-allowlist.dto';
import { RejectAllowlistDto } from '../dto/reject-allowlist.dto';
import { ActionsService } from '../../actions/services/actions.service';
import { Request } from 'express';

@Injectable()
export class AllowlistsService {
    constructor(
        @InjectRepository(Allowlist)
        private allowlistsRepository: Repository<Allowlist>,
        private readonly discordService: DiscordService,
        private readonly actionsService: ActionsService,
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
        const username = await this.discordService.getUsername(allowlist.userId);
        await this.actionsService.logAction(
            'aprovou',
            'whitelist #' + allowlist.id + ' de ' + username,
            loggedUserName,
        );

        if (process.env.DISCORD_GUILD_ID && process.env.DISCORD_ROLE_APPROVED_ID) {
            await this.discordService.addRole(allowlist.userId, process.env.DISCORD_GUILD_ID, process.env.DISCORD_ROLE_APPROVED_ID);
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
        const username = await this.discordService.getUsername(allowlist.userId);
        await this.actionsService.logAction(
            'rejeitou',
            'whitelist #' + allowlist.id + ' de ' + username,
            loggedUserName,
        );
        return this.allowlistsRepository.save(allowlist);
    }
}