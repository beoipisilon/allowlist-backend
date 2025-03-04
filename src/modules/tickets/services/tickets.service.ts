// src/allowlists/allowlists.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Ticket } from '../entities/tickets.entity';
import { DiscordService } from '../../discord/services/discord.service';
import { ActionsService } from '../../actions/services/actions.service';
import { Request } from 'express';
import { GenerateUnlockCodeDto } from '../dto/generate-unlock-code.dto';
import { EmbedBuilder } from '@discordjs/builders';
import { TokensService } from '../../tokens/services/tokens.service';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
        private readonly discordService: DiscordService,
        private readonly actionsService: ActionsService,
        private readonly tokensService: TokensService,
    ) {}

    async getAll() {
        const tickets = await this.ticketsRepository.find({where: {createdAt: MoreThan(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7))}});
        const ticketsWithDetails = await Promise.all(
            tickets.map(async (ticket) => {
                const username = await this.discordService.getUsername(ticket.discordId);
                const avatarUrl = await this.discordService.getAvatarUrl(ticket.discordId);
                return {
                ...ticket,
                username,
                avatarUrl,
                };
            }),
        );

        return ticketsWithDetails;
    }

    async generateToken(dto: GenerateUnlockCodeDto, req: Request) {
        const ticket = await this.ticketsRepository.findOne({where: {id: parseInt(dto.ticketId)}});
        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }
        if (ticket.generatedToken) {
            throw new BadRequestException('Token already generated');
        }

        const token = Math.random().toString(36).substring(2, 8);
        ticket.generatedToken = true;
        ticket.token = token.toUpperCase();
        ticket.status = 'approved';
        await this.ticketsRepository.save(ticket);

        await this.tokensService.create({
            token: token.toUpperCase(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
            maxUses: 1,
            type: 'unlock-code',
            uses: 0,
            discordId: ticket.discordId,
        }, req);

        const embed = new EmbedBuilder()
            .setColor([255, 207, 90])
            .setTitle('Código de desbloqueio')
            .setDescription(`> **Gerado por:**\n${req.session.user?.username}\n\n> **Código:**\n||${token}||\n\n_Este código expirará em 2 dias_`);
        await this.discordService.sendMessage(ticket.channelId, embed);
        return token;
    }
}