// src/allowlists/allowlists.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tokens } from '../entities/tokens.entity';
import { CreateTokenDto } from '../dto/create-token.dto';
import { Request } from 'express';
import { ActionsService } from '../../actions/services/actions.service';

@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(Tokens)
        private tokensRepository: Repository<Tokens>,
        private readonly actionsService: ActionsService,
    ) {}

    async getAll() {
        const tokens = await this.tokensRepository.find();
        return tokens;
    }

    async useToken(id: number) {
        const token = await this.tokensRepository.findOne({ where: { id } });
        if (!token) {
            throw new NotFoundException('Token not found');
        }
        if (token.uses >= token.maxUses) {
            throw new BadRequestException('Token has reached max uses');
        }
        return this.tokensRepository.update(id, { uses: token.uses + 1 });
    }

    async create(createTokenDto: CreateTokenDto, req: Request) {
        const token = await this.tokensRepository.findOne({ where: { token: createTokenDto.token.toLowerCase() } });
        if (token) {
            throw new BadRequestException('Token já existe');
        }
        createTokenDto.token = createTokenDto.token.toUpperCase();
        createTokenDto.expiresAt = new Date(createTokenDto.expiresAt);
        
        const loggedUserName = req.session.user?.username;
        await this.actionsService.logAction(
            'criou',
            'o código ' + createTokenDto.token,
            loggedUserName,
        );
        return this.tokensRepository.save(createTokenDto);
    }

    async delete(id: number, req: Request) {
        const token = await this.tokensRepository.findOne({ where: { id } });
        if (!token) {
            throw new NotFoundException('Token not found');
        }
        await this.tokensRepository.delete(id);
        const loggedUserName = req.session.user?.username;
        await this.actionsService.logAction(
            'deletou',
            'o código ' + token.token,
            loggedUserName,
        );
        return { message: 'Código deletado com sucesso!' };
    }
}