import { Controller, Get, Patch, Param, UseGuards, Post, Body, Delete, Req } from '@nestjs/common';
import { TokensService } from '../services/tokens.service';
import { DiscordAuthGuard } from '../../auth/guards/auth.guard';
import { CreateTokenDto } from '../dto/create-token.dto';
import { Request } from 'express';

@Controller('tokens')
export class TokensController {
    constructor(private tokensService: TokensService) {}

    @Get()
    @UseGuards(DiscordAuthGuard)
    getAllTokens() {
        return this.tokensService.getAll();
    }

    @Patch(':id/use')
    @UseGuards(DiscordAuthGuard)
    useToken(@Param('id') id: number) {
        return this.tokensService.useToken(id);
    }

    @Post()
    @UseGuards(DiscordAuthGuard)
    createToken(@Body() createTokenDto: CreateTokenDto, @Req() req: Request) {
        console.log(createTokenDto);
        return this.tokensService.create(createTokenDto, req);
    }
    
    @Delete(':id')
    @UseGuards(DiscordAuthGuard)
    deleteToken(@Param('id') id: number, @Req() req: Request) {
        return this.tokensService.delete(id, req);
    }
}
