import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../discord/services/discord.service';
import { DiscordProfile } from '../interfaces/discord-profile.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly discordService: DiscordService,
    ) {}

    async handleDiscordCallback(discordProfile: DiscordProfile): Promise<DiscordProfile> {
        const guildId = process.env.DISCORD_GUILD_ID || ''; 
        const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID || '933800380247191562'; 
        const moderatorRoleId = process.env.DISCORD_MODERATOR_ROLE_ID || '933800422752264252'; 

        // Buscar as roles do usuário no Discord
        const roles = await this.discordService.getUserRoles(discordProfile.id, guildId);
        let permission: 'administrador' | 'moderador' | 'user' = 'user';

        if (roles.includes(adminRoleId)) {
            permission = 'administrador';
        } else if (roles.includes(moderatorRoleId)) {
            permission = 'moderador';
        }

        return {
            id: discordProfile.id,
            username: discordProfile.username,
            avatar: discordProfile.avatar,
            permission,
        };
    }

    async getUserFromSession(sessionUser: DiscordProfile): Promise<DiscordProfile> {
        const guildId = process.env.DISCORD_GUILD_ID || ''; 
        const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID || '933800380247191562'; 
        const moderatorRoleId = process.env.DISCORD_MODERATOR_ROLE_ID || '933800422752264252'; 

        console.log(sessionUser.id, guildId, 'linha 39');
        // Buscar as roles do usuário no Discord
        const roles = await this.discordService.getUserRoles(sessionUser.id, guildId);
        let permission: 'administrador' | 'moderador' | 'user' = 'user';

        if (roles.includes(adminRoleId)) {
            permission = 'administrador';
        } else if (roles.includes(moderatorRoleId)) {
            permission = 'moderador';
        }

        sessionUser.permission = permission;
        console.log(sessionUser, 'linha 51');
        return sessionUser || null;
    }

    async validateUser(profile: DiscordProfile): Promise<DiscordProfile> {
        return {
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            permission: 'user',
        };
    }
}