import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordService {
    private client: Client;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers
            ],
        });

        this.client.login(process.env.DISCORD_BOT_TOKEN); 
    }

    async getUsername(discordId: string): Promise<string> {
        try {
            const user = await this.client.users.fetch(discordId);
            return user.username;
        } catch (error) {
            console.error('Erro ao buscar usuário no Discord:', error);
            return 'Usuário não encontrado';
        }
    }

    async getAvatarUrl(discordId: string): Promise<string | null> {
        try {
            const user = await this.client.users.fetch(discordId);
            return user.avatarURL();
        } catch (error) {
            console.error('Erro ao buscar avatar do usuário no Discord:', error);
            return null;
        }
    }

    async addRole(discordId: string, guildId: string, roleId: string): Promise<void> {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) {
            throw new Error('Guild not found');
        }
        
        const member = await guild.members.fetch(discordId);
        if (!member) {
            throw new Error('Member not found');
        }
        
        const role = guild.roles.cache.get(roleId);
        if (!role) {
            throw new Error('Role not found');
        }
        
        await member.roles.add(role);
    }

    async getUserRoles(discordId: string, guildId: string): Promise<string[]> {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                throw new Error('Guild not found');
            }

            const member = await guild.members.fetch(discordId);
            if (!member) {
                throw new Error('Member not found');
            }

            // Retorna as IDs das roles do usuário
            return member.roles.cache.map(role => role.id);
        } catch (error) {
            console.error(`Erro ao buscar roles do usuário ${discordId}:`, error);
            return [];
        }
    }

    async getStaffMembers(guildId: string, adminRoleId: string, moderatorRoleId: string): Promise<any[]> {
        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                throw new Error('Guild not found');
            }

            await guild.members.fetch();

            const staffMembers = guild.members.cache.filter(member =>
                member.roles.cache.has(adminRoleId) || member.roles.cache.has(moderatorRoleId)
            );

            return staffMembers.map(member => ({
                discordId: member.user.id,
                username: member.user.username,
                avatarUrl: member.user.avatarURL(),
                roles: member.roles.cache.map(role => role.id), 
            }));
        } catch (error) {
            console.error('Erro ao buscar membros do Discord:', error);
            return [];
        }
    }
}
