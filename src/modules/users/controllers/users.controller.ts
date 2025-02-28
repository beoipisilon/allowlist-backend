import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { StaffGuard } from '../../auth/guards/staff.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    @UseGuards(DiscordAuthGuard, StaffGuard)
    async findAll() {
        return this.usersService.findAll();
    }
}