import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersDashboard } from '../../users/entities/users.entity';
import { DiscordProfile } from '../interfaces/discord-profile.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersDashboard)
        private readonly usersRepository: Repository<UsersDashboard>,
    ) {}

    async handleDiscordCallback(discordProfile: DiscordProfile): Promise<DiscordProfile> {
        const user = await this.usersRepository.findOne({ where: { discordId: discordProfile.id } });

        if (user) {
        discordProfile.permission = user.permission;
        } else {
        discordProfile.permission = 'user';
        }

        return discordProfile;
    }

    async getUserFromSession(sessionUser: DiscordProfile): Promise<DiscordProfile> {
        const user = await this.usersRepository.findOne({ where: { discordId: sessionUser.id } });

        if (!user) {
        throw new NotFoundException('Usuário não encontrado no banco de dados');
        }

        sessionUser.permission = user.permission;
        return sessionUser;
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