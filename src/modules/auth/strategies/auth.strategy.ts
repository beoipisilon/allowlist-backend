import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(configService: ConfigService) {
        super({
        clientID: configService.get('DISCORD_CLIENT_ID'),
        clientSecret: configService.get('DISCORD_CLIENT_SECRET'),
        callbackURL: configService.get('DISCORD_REDIRECT_URI'),
        scope: ['identify'],
        });
    }

    async validate(accessToken, refreshToken, profile) {
        return { id: profile.id, username: profile.username, avatar: profile.avatar };
    }
}