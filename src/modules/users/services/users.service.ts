import { Injectable, BadRequestException } from '@nestjs/common';
import { DiscordService } from '../../discord/services/discord.service';
import { UsersDashboard } from '../interfaces/users.interface';
import { BotSettingsService } from '../../bot-settings/bot-settings.service';
import { AuditService } from '../../audit/services/audit.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly discordService: DiscordService,
        private readonly botSettingsService: BotSettingsService,
        private readonly auditService: AuditService,
    ) {}

    async findAll(): Promise<UsersDashboard[]> {      
        const guildId = process.env.DISCORD_GUILD_ID || '';
        const settings = await this.botSettingsService.findAll();
        const adminRoleId = settings.adminRoleId;
        const moderatorRoleId = settings.modRoleId;
        const supportRoleId = settings.supportRoleId;

        const members = await this.discordService.getStaffMembers(guildId, adminRoleId, moderatorRoleId); 
        const membersWithDetails: UsersDashboard[] = members.map(member => ({
            id: member.discordId,
            discordId: member.discordId,
            username: member.username,
            avatarUrl: member.avatarUrl,
            permission: member.roles.includes(adminRoleId) ? 'administrador' : 
                       member.roles.includes(moderatorRoleId) ? 'moderador' : 
                       member.roles.includes(supportRoleId) ? 'suporte' : 'user',
        }));
    
        return membersWithDetails;
    }

    async addRoleToUser(discordId: string, roleName: string, userId: string, loggedUserName: string, userAvatar: string): Promise<void> {
        const guildId = process.env.DISCORD_GUILD_ID || '';
        const settings = await this.botSettingsService.findAll();
        
        console.log('Linha 40', discordId, roleName, userId, loggedUserName, userAvatar)
        let roleId: string | undefined;
        
        switch (roleName.toLowerCase()) {
            case 'administrador':
                roleId = settings.adminRoleId;
                break;
            case 'moderador':
                roleId = settings.modRoleId;
                break;
            case 'suporte':
                roleId = settings.supportRoleId;
                break;
            default:
                throw new BadRequestException(`Cargo '${roleName}' não reconhecido`);
        }
        
        if (!roleId) {
            throw new BadRequestException(`ID do cargo '${roleName}' não configurado`);
        }
        
        await this.discordService.addRole(discordId, guildId, roleId);
        
        // Registrar a ação no log de auditoria
        await this.auditService.logCreate(
            userId,
            loggedUserName,
            userAvatar,
            'user_role',
            discordId,
            `Cargo '${roleName}' adicionado ao usuário`
        );
    }
    
    async removeRoleFromUser(discordId: string, roleName: string, userId: string, loggedUserName: string, userAvatar: string): Promise<void> {
        const guildId = process.env.DISCORD_GUILD_ID || '';
        const settings = await this.botSettingsService.findAll();
        
        let roleId: string | undefined;
        
        switch (roleName.toLowerCase()) {
            case 'administrador':
                roleId = settings.adminRoleId;
                break;
            case 'moderador':
                roleId = settings.modRoleId;
                break;
            case 'suporte':
                roleId = settings.supportRoleId;
                break;
            default:
                throw new BadRequestException(`Cargo '${roleName}' não reconhecido`);
        }
        
        if (!roleId) {
            throw new BadRequestException(`ID do cargo '${roleName}' não configurado`);
        }
        
        await this.discordService.removeRole(discordId, guildId, roleId);
        
        // Registrar a ação no log de auditoria
        await this.auditService.logDelete(
            userId,
            loggedUserName,
            userAvatar,
            'user_role',
            discordId,
            `Cargo '${roleName}' removido do usuário`
        );
    }
}
