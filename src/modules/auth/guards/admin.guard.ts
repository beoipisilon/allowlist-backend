import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DiscordAuthGuard } from './auth.guard';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly discordAuthGuard: DiscordAuthGuard) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = await this.discordAuthGuard.canActivate(context);
        if (!isAuthenticated) return false;

        const request = context.switchToHttp().getRequest();
        const session = request.session;
        return session && session.user && session.user.permission === 'admin';
    }
}