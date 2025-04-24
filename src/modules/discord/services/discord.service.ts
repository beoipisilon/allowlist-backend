import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';
import { EmbedBuilder } from '@discordjs/builders';

@Injectable()
export class DiscordService {
    private client: Client;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences
            ],
        });

        this.client.login(process.env.DISCORD_BOT_TOKEN); 
    }

    async getBotInfo() {
        const bot = this.client.user;
        if (!bot) {
            throw new Error('Bot not initialized');
        }

        return {
            name: bot.username,
            avatar: bot.displayAvatarURL({ size: 256 }),
            status: bot.presence?.status || 'offline',
            activity: bot.presence?.activities[0] ? {
                type: bot.presence.activities[0].type.toString(),
                name: bot.presence.activities[0].name,
            } : null,
            description: bot.tag || '',
        };
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

    async removeRole(discordId: string, guildId: string, roleId: string): Promise<void> {
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
        
        await member.roles.remove(role);
    }

    async sendText(channelId: string, message: string) {
        const channel = this.client.channels.cache.get(channelId);
        if (!channel) {
            throw new Error('Channel not found');
        }
        await (channel as TextChannel).send({ content: message });
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

    async sendMessage(channelId: string, embed: EmbedBuilder) {
        const channel = this.client.channels.cache.get(channelId);
        if (!channel) {
            throw new Error('Channel not found');
        }
        await (channel as TextChannel).send({ embeds: [embed] });
    }
}
