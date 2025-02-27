// auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UsersDashboard } from '../../users/entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        @InjectRepository(UsersDashboard)
        private readonly usersRepository: Repository<UsersDashboard>,
        private readonly authService: AuthService,
    ) {}

    @Get('discord')
    @UseGuards(AuthGuard('discord'))
    login() {
        console.log('Login realizado com sucesso');
    }

    @Get('discord/callback')
    @UseGuards(AuthGuard('discord'))
    async callback(@Req() req: Request, @Res() res: Response) {
        try {
            if (!req.user) {
                console.error('Nenhum usuário retornado pelo Discord');
                return res.redirect(`${process.env.FRONTEND_URL}/login`);
            }

            const user = await this.authService.handleDiscordCallback(req.user);
            req.session.user = user;
            req.session.isAuthenticated = true;

            console.log(user,'linha 37');
            if (user.permission === 'user') {
                return res.redirect(`${process.env.FRONTEND_URL}/access-denied`);
            }

            return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        } catch (error) {
            console.error('Erro no callback do Discord:', error);
            return res.redirect(`${process.env.FRONTEND_URL}/login`);
        }
    }

    @Get('me')
    async getUser(@Req() req: Request) {
        console.log(req.session.user);
        if (!req.session.user) {
            return null;
        }

        const user = await this.authService.getUserFromSession(req.session.user);
        return user || null;
    }

    @Get('logout')
    logout(@Req() req: Request, @Res() res: Response) {
        req.session.destroy(() => {
        res.clearCookie('connect.sid', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect(`${process.env.FRONTEND_URL}/login`);
        });
    }
}