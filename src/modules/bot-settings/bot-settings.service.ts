import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotSettings } from './entities/bot-settings.entity';
import { UpdateBotSettingsDto } from './dto/update-bot-settings.dto';
import { DiscordService } from '../discord/services/discord.service';
import { AuditService } from '../audit/services/audit.service';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class BotSettingsService {
    constructor(
        @InjectRepository(BotSettings)
        private readonly botSettingsRepository: Repository<BotSettings>,
        private readonly discordService: DiscordService,
        private readonly auditService: AuditService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}

    async findAll() {
        const settings = await this.botSettingsRepository.find();
        const botInfo = await this.discordService.getBotInfo();
        
        return {
            ...botInfo,
            ...(settings[0] || {}),
        };
    }

    async update(updateBotSettingsDto: UpdateBotSettingsDto, userId: string, loggedUserName: string, userAvatar: string) {
        let settings = await this.botSettingsRepository.findOne({ where: {} });
        
        if (!settings) {
            settings = this.botSettingsRepository.create();
        }

        const oldSettings = { ...settings };
        Object.assign(settings, updateBotSettingsDto);
        
        const savedSettings = await this.botSettingsRepository.save(settings);

        // Log changes in audit
        const changes: string[] = [];
        if (oldSettings.adminRoleId !== settings.adminRoleId) {
            changes.push(`ID do cargo Admin alterado de ${oldSettings.adminRoleId || 'não definido'} para ${settings.adminRoleId || 'não definido'}`);
        }
        if (oldSettings.modRoleId !== settings.modRoleId) {
            changes.push(`ID do cargo Moderador alterado de ${oldSettings.modRoleId || 'não definido'} para ${settings.modRoleId || 'não definido'}`);
        }
        if (oldSettings.supportRoleId !== settings.supportRoleId) {
            changes.push(`ID do cargo Suporte alterado de ${oldSettings.supportRoleId || 'não definido'} para ${settings.supportRoleId || 'não definido'}`);
        }
        if (oldSettings.logChannelId !== settings.logChannelId) {
            changes.push(`ID do canal de logs alterado de ${oldSettings.logChannelId || 'não definido'} para ${settings.logChannelId || 'não definido'}`);
        }
        if (oldSettings.codeLogChannelId !== settings.codeLogChannelId) {
            changes.push(`ID do canal de logs de códigos alterado de ${oldSettings.codeLogChannelId || 'não definido'} para ${settings.codeLogChannelId || 'não definido'}`);
        }
        if (oldSettings.codeErrorChannelId !== settings.codeErrorChannelId) {
            changes.push(`ID do canal de logs de erros de códigos alterado de ${oldSettings.codeErrorChannelId || 'não definido'} para ${settings.codeErrorChannelId || 'não definido'}`);
        }

        if (oldSettings.logBannedChannelId !== settings.logBannedChannelId) {
            changes.push(`ID do canal de whitelist alterado de ${oldSettings.logBannedChannelId || 'não definido'} para ${settings.logBannedChannelId || 'não definido'}`);
        }

        if (oldSettings.categoryReviewChannelId !== settings.categoryReviewChannelId) {
            changes.push(`ID da categoria de revisão alterado de ${oldSettings.categoryReviewChannelId || 'não definido'} para ${settings.categoryReviewChannelId || 'não definido'}`);
        }

        if (oldSettings.categoryBlockChannelId !== settings.categoryBlockChannelId) {
            changes.push(`ID da categoria de bloqueio alterado de ${oldSettings.categoryBlockChannelId || 'não definido'} para ${settings.categoryBlockChannelId || 'não definido'}`);
        }

        if (changes.length > 0) {
            await this.auditService.logUpdate(
                userId,
                loggedUserName,
                userAvatar,
                'bot_settings',
                '1',
                changes.join('\n'),
                JSON.stringify(oldSettings),
                JSON.stringify(savedSettings)
            );
        }

        return savedSettings;
    }
} 