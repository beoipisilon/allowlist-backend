import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionService {
    constructor(
        @InjectRepository(Session)
        private readonly sessionRepository: Repository<Session>,
    ) {}

    async findAll(): Promise<Session[]> {
        return this.sessionRepository.find();
    }

    async findOne(id: string): Promise<Session | null> {
        return this.sessionRepository.findOne({ where: { id } });
    }

    async update(id: string, data: Partial<Session>): Promise<Session> {
        const session = await this.findOne(id);
        if (!session) {
            throw new Error(`Session with ID ${id} not found`);
        }

        Object.assign(session, data);
        return this.sessionRepository.save(session);
    }

    async remove(id: string): Promise<void> {
        await this.sessionRepository.delete(id);
    }
} 