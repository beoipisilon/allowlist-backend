import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersDashboard } from '../entities/users.entity';
import { DiscordService } from '../../discord/services/discord.service';
import { ActionsService } from '../../actions/services/actions.service';
import { Request } from 'express';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersDashboard)
        private usersRepository: Repository<UsersDashboard>,
        private readonly discordService: DiscordService,
        private readonly actionsService: ActionsService,
    ) {}

    async findAll(): Promise<UsersDashboard[]> {
        const users = await this.usersRepository.find();
      
        const usersWithDetails = await Promise.all(
          users.map(async (user) => {
            const username = await this.discordService.getUsername(user.discordId);
            const avatarUrl = await this.discordService.getAvatarUrl(user.discordId);
            return {
              ...user,
              username,
              avatarUrl,
            };
          }),
        );
      
        return usersWithDetails;
    }

    async create(user: UsersDashboard, req: Request) {
        const userExists = await this.usersRepository.findOne({ where: { discordId: user.discordId } });
        if (userExists) {
            throw new Error('Usuário já existe');
        } else {
            await this.usersRepository.save(user);

            const loggedUserName = req.session.user?.username;
            const username = await this.discordService.getUsername(user.discordId);
            await this.actionsService.logAction(
                'criou',
                'o usuário ' + username + ' de ' + user.permission,
                loggedUserName,
            );
        }
    }

    async delete(userId: string, req: Request): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id: parseInt(userId) } });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        
        await this.usersRepository.remove(user);
        
        // Log action
        const loggedUserName = req.session.user?.username;
        const username = await this.discordService.getUsername(user.discordId);
        await this.actionsService.logAction(
            'deletou',
            'o usuário ' + username,
            loggedUserName,
        );
    }

    async updatePermission(userId: string, permission: string, req: Request): Promise<UsersDashboard> {
        const user = await this.usersRepository.findOne({ where: { id: parseInt(userId) } });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        user.permission = permission;
        const updatedUser = await this.usersRepository.save(user);
    
        const loggedUserName = req.session.user?.username;
        const username = await this.discordService.getUsername(user.discordId);
        await this.actionsService.logAction(
          'atualizou',
          'a permissão do usuário ' + username + ' para ' + permission,
          loggedUserName,
        );
    
        return updatedUser;
    }
}
