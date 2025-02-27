import { Controller, Get, Patch, Param, UseGuards, Post, Body, Delete, Put, Req } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersDashboard } from '../entities/users.entity';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @UseGuards(DiscordAuthGuard, AdminGuard)
    async findAll() {
        return this.usersService.findAll();
    }

    @Post()
    @UseGuards(DiscordAuthGuard, AdminGuard) 
    async create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
        return this.usersService.create(createUserDto as UsersDashboard, req);
    }

    @Put(':userId/permission')
    @UseGuards(DiscordAuthGuard, AdminGuard) 
    async updatePermission(
        @Param('userId') userId: string,
        @Body() body: { permission: string },
        @Req() req: Request,  
    ) {
        console.log(userId, body.permission);
        return this.usersService.updatePermission(userId, body.permission, req);
    }

    @Delete(':userId')
    @UseGuards(DiscordAuthGuard, AdminGuard)
    async delete(@Param('userId') userId: string, @Req() req: Request) {
        return this.usersService.delete(userId, req);
    }
}