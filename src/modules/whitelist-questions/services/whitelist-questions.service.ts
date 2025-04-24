import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhitelistQuestion } from '../entities/whitelist-questions.entity';
import { CreateWhitelistQuestionDto } from '../dto/create-whitelist-question.dto';
import { UpdateWhitelistQuestionDto } from '../dto/update-whitelist-question.dto';
import { AuditService } from '../../audit/services/audit.service';
import { Request } from 'express';

@Injectable()
export class WhitelistQuestionsService {
    constructor(
        @InjectRepository(WhitelistQuestion)
        private whitelistQuestionsRepository: Repository<WhitelistQuestion>,
        private readonly auditService: AuditService,
    ) {}

    async findAll(): Promise<WhitelistQuestion[]> {
        return this.whitelistQuestionsRepository.find();
    }

    async findOne(id: number): Promise<WhitelistQuestion> {
        if (!id || isNaN(id)) {
            throw new BadRequestException('ID inválido');
        }

        const question = await this.whitelistQuestionsRepository.findOne({ where: { id } });
        if (!question) {
            throw new NotFoundException(`Pergunta com ID ${id} não encontrada`);
        }
        return question;
    }

    async create(createWhitelistQuestionDto: CreateWhitelistQuestionDto, req: Request): Promise<WhitelistQuestion> {
        const question = this.whitelistQuestionsRepository.create(createWhitelistQuestionDto);
        const savedQuestion = await this.whitelistQuestionsRepository.save(question);

        // Log audit
        if (req.session?.user) {
            await this.auditService.logCreate(
                req.session.user.id,
                req.session.user.username,
                req.session.user.avatar,
                'whitelist_question',
                savedQuestion.id.toString(),
                `Criou a pergunta ${savedQuestion.text}`,
                JSON.stringify(savedQuestion)
            );
        }

        return savedQuestion;
    }

    async update(id: number, updateWhitelistQuestionDto: UpdateWhitelistQuestionDto, req: Request): Promise<WhitelistQuestion> {
        if (!id || isNaN(id)) {
            throw new BadRequestException('ID inválido');
        }

        const question = await this.findOne(id);
        Object.assign(question, updateWhitelistQuestionDto);
        const updatedQuestion = await this.whitelistQuestionsRepository.save(question);

        // Log audit
        if (req.session?.user) {
            await this.auditService.logUpdate(
                req.session.user.id,
                req.session.user.username,
                req.session.user.avatar,
                'whitelist_question',
                id.toString(),
                `Atualizou a pergunta ${question.text}`,
                JSON.stringify(updatedQuestion)
            );
        }

        return updatedQuestion;
    }

    async remove(id: number, req: Request): Promise<void> {
        if (!id || isNaN(id)) {
            throw new BadRequestException('ID inválido');
        }

        const question = await this.findOne(id);
        await this.whitelistQuestionsRepository.delete(id);

        // Log audit
        if (req.session?.user) {
            await this.auditService.logDelete(
                req.session.user.id,
                req.session.user.username,
                req.session.user.avatar,
                'whitelist_question',
                id.toString(),
                `Deletou a pergunta ${question.text}`,
                JSON.stringify(question)
            );
        }
    }
} 