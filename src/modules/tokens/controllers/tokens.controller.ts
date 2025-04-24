import { Controller, Get, Patch, Param, UseGuards, Post, Body, Delete, Req } from '@nestjs/common';
import { TokensService } from '../services/tokens.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { CreateTokenDto } from '../dto/create-token.dto';
import { Request } from 'express';
import { RequirePermissions } from '../../permissions/decorators/require-permissions.decorator';

@Controller('tokens')
@UseGuards(DiscordAuthGuard)
export class TokensController {
    constructor(private tokensService: TokensService) {}

    @Get()
    @RequirePermissions('view_tokens')
    getAllTokens() {
        return this.tokensService.getAll();
    }

    @Patch(':id/use')
    @RequirePermissions('manage_tokens')
    useToken(@Param('id') id: number) {
        return this.tokensService.useToken(id);
    }

    @Post()
    @RequirePermissions('manage_tokens')
    createToken(@Body() createTokenDto: CreateTokenDto, @Req() req: Request) {
        console.log(createTokenDto);
        return this.tokensService.create(createTokenDto, req);
    }
    
    @Delete(':id')
    @RequirePermissions('manage_tokens')
    deleteToken(@Param('id') id: number, @Req() req: Request) {
        return this.tokensService.delete(id, req);
    }
}
