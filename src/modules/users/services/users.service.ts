import { Injectable } from '@nestjs/common';
import { DiscordService } from '../../discord/services/discord.service';
import { UsersDashboard } from '../interfaces/users.interface';

@Injectable()
export class UsersService {
    constructor(private readonly discordService: DiscordService) {}

    async findAll(): Promise<UsersDashboard[]> {      
        const guildId = process.env.DISCORD_GUILD_ID || ''; 
        const adminRoleId = process.env.DISCORD_ADMIN_ROLE_ID || '933800380247191562'; 
        const moderatorRoleId = process.env.DISCORD_MODERATOR_ROLE_ID || '933800422752264252'; 
    
        const members = await this.discordService.getStaffMembers(guildId, adminRoleId, moderatorRoleId); 
        const membersWithDetails: UsersDashboard[] = members.map(member => ({
            id: member.discordId,
            discordId: member.discordId,
            username: member.username,
            avatarUrl: member.avatarUrl,
            permission: member.roles.includes(adminRoleId) ? 'administrador' : 'moderador',
        }));
    
        return membersWithDetails;
    }
}
