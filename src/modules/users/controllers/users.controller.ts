import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';
import { Request } from 'express';
import { AddRoleDto } from '../dto/add-role.dto';
import { RemoveRoleDto } from '../dto/remove-role.dto';

@Controller('users')
@UseGuards(DiscordAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @RequirePermissions('view_users')
    async findAll() {
        return this.usersService.findAll();
    }

    @Post('role')
    @RequirePermissions('manage_users')
    async addRoleToUser(
        @Body() addRoleDto: AddRoleDto,
        @Req() req: Request
    ) {
        const user = req.session.user as any;
        return this.usersService.addRoleToUser(
            addRoleDto.discordId,
            addRoleDto.roleName,
            user.id,
            user.username,
            user.avatar
        );
    }

    @Delete('role')
    @RequirePermissions('manage_users')
    async removeRoleFromUser(
        @Body() removeRoleDto: RemoveRoleDto,
        @Req() req: Request
    ) {
        const user = req.session.user as any;
        return this.usersService.removeRoleFromUser(
            removeRoleDto.discordId,
            removeRoleDto.roleName,
            user.id,
            user.username,
            user.avatar
        );
    }
}