// src/actions/actions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from '../entities/actions.entity';

@Injectable()
export class ActionsService {
    constructor(
        @InjectRepository(Action)
        private actionsRepository: Repository<Action>,
    ) {}

    async logAction(action: string, target: string, user: string): Promise<Action> {
        console.log(user, action, target);
        const newAction = this.actionsRepository.create({
        user,
        action,
        target,
        });
        return this.actionsRepository.save(newAction);
    }
}