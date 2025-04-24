// src/allowlists/allowlists.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tokens } from '../entities/tokens.entity';
import { CreateTokenDto } from '../dto/create-token.dto';
import { Request } from 'express';
import { AuditService } from '../../audit/services/audit.service';
import { AuditActionType } from '../../audit/entities/audit-log.entity';

@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(Tokens)
        private tokensRepository: Repository<Tokens>,
        private readonly auditService: AuditService,
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
        console.log(createTokenDto,'linha 36')
        
        const token = await this.tokensRepository.findOne({ where: { token: createTokenDto.token.toLowerCase() } });
        if (token) {
            throw new BadRequestException('Token já existe');
        }
        createTokenDto.token = createTokenDto.token.toUpperCase();
        createTokenDto.expiresAt = new Date(createTokenDto.expiresAt);
        
        const loggedUserName = req.session.user?.username;
        const userId = req.session.user?.id;
        const userAvatar = req.session.user?.avatar;

        // Log na tabela de auditoria
        await this.auditService.logCreate(
            userId,
            loggedUserName,
            userAvatar,
            'token',
            createTokenDto.token,
            `Criou o código ${createTokenDto.token}`
        );

        return this.tokensRepository.save(createTokenDto);
    }

    async delete(id: number, req: Request) {
        const token = await this.tokensRepository.findOne({ where: { id } });
        if (!token) {
            throw new NotFoundException('Token not found');
        }

        const loggedUserName = req.session.user?.username;
        const userId = req.session.user?.id;
        const userAvatar = req.session.user?.avatar;

        // Log na tabela de auditoria
        await this.auditService.logDelete(
            userId,
            loggedUserName,
            userAvatar,
            'token',
            token.token,
            `Deletou o código ${token.token}`
        );

        await this.tokensRepository.delete(id);
        return { message: 'Código deletado com sucesso!' };
    }
}