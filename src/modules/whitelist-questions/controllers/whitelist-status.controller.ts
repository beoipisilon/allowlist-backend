import { Controller, Get, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { WhitelistStatusService } from '../services/whitelist-status.service';
import { UpdateWhitelistStatusDto } from '../dto/update-whitelist-status.dto';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';
import { PermissionsGuard } from '../../permissions/guards/permissions.guard';

@Controller('whitelist-status')
@UseGuards(DiscordAuthGuard, PermissionsGuard)
export class WhitelistStatusController {
    constructor(private readonly whitelistStatusService: WhitelistStatusService) {}

    @Get()
    @RequirePermissions('view_allowlists_questions')
    async getStatus() {
        try {
            return await this.whitelistStatusService.getStatus();
        } catch (error) {
            throw new BadRequestException('Erro ao buscar status da whitelist');
        }
    }

    @Post()
    @RequirePermissions('manage_allowlists_questions')
    async updateStatus(@Body() updateWhitelistStatusDto: UpdateWhitelistStatusDto) {
        try {
            return await this.whitelistStatusService.updateStatus(updateWhitelistStatusDto);
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar status da whitelist');
        }
    }
} 