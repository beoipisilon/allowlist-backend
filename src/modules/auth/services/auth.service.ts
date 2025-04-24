import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { DiscordService } from '../../discord/services/discord.service';
import { DiscordProfile } from '../interfaces/discord-profile.interface';
import { PermissionsService } from '../../permissions/services/permissions.service';
import { BotSettingsService } from '../../bot-settings/bot-settings.service';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly discordService: DiscordService,
        @Inject(forwardRef(() => PermissionsService))
        private readonly permissionsService: PermissionsService,
        @Inject(forwardRef(() => BotSettingsService))
        private readonly botSettingsService: BotSettingsService,
        private readonly sessionService: SessionService,
    ) {}

    async handleDiscordCallback(discordProfile: DiscordProfile): Promise<DiscordProfile> {
        const guildId = process.env.DISCORD_GUILD_ID || '';
        const settings = await this.botSettingsService.findAll();
        const adminRoleId = settings.adminRoleId;
        const moderatorRoleId = settings.modRoleId;
        const supportRoleId = settings.supportRoleId;

        // Buscar as roles do usuário no Discord
        const roles = await this.discordService.getUserRoles(discordProfile.id, guildId);
        let permission: 'administrador' | 'moderador' | 'suporte' | 'user' = 'user';

        if (roles.includes(adminRoleId)) {
            permission = 'administrador';
        } else if (roles.includes(moderatorRoleId)) {
            permission = 'moderador';
        } else if (roles.includes(supportRoleId)) {
            permission = 'suporte';
        }

        // Buscar as permissões do cargo no banco de dados
        const rolePermissions = await this.permissionsService.getPermissionsByRole(permission);
        
        return {
            id: discordProfile.id,
            username: discordProfile.username,
            avatar: discordProfile.avatar,
            permission,
            permissions: rolePermissions || {},
        };
    }

    async getUserFromSession(sessionUser: DiscordProfile): Promise<DiscordProfile> {
        const guildId = process.env.DISCORD_GUILD_ID || '';
        const settings = await this.botSettingsService.findAll();
        const adminRoleId = settings.adminRoleId;
        const moderatorRoleId = settings.modRoleId;
        const supportRoleId = settings.supportRoleId;

        // Buscar as roles do usuário no Discord
        const roles = await this.discordService.getUserRoles(sessionUser.id, guildId);
        let permission: 'administrador' | 'moderador' | 'suporte' | 'user' = 'user';

        if (roles.includes(adminRoleId)) {
            permission = 'administrador';
        } else if (roles.includes(moderatorRoleId)) {
            permission = 'moderador';
        } else if (roles.includes(supportRoleId)) {
            permission = 'suporte';
        }

        sessionUser.permission = permission;
        
        // Buscar as permissões do cargo no banco de dados
        const rolePermissions = await this.permissionsService.getPermissionsByRole(permission);
        sessionUser.permissions = rolePermissions || {};
        
        return sessionUser || null;
    }

    async validateUser(profile: DiscordProfile): Promise<DiscordProfile> {
        // Buscar as permissões do cargo no banco de dados
        const rolePermissions = await this.permissionsService.getPermissionsByRole('user');
        
        return {
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            permission: 'user',
            permissions: rolePermissions || {},
        };
    }

    async updateUserPermissionsByRole(roleName: string): Promise<void> {
        // Busca as permissões atualizadas do cargo
        const rolePermissions = await this.permissionsService.getPermissionsByRole(roleName);
        if (!rolePermissions) return;

        // Atualiza as permissões de todos os usuários que têm esse cargo
        const sessions = await this.sessionService.findAll();
        for (const session of sessions) {
            const user = session.user as DiscordProfile;
            if (user.permission === roleName) {
                user.permissions = rolePermissions;
                await this.sessionService.update(session.id, { user });
            }
        }
    }
}