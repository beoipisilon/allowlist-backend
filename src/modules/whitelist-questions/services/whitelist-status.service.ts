import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhitelistStatus } from '../entities/whitelist-status.entity';
import { UpdateWhitelistStatusDto } from '../dto/update-whitelist-status.dto';

@Injectable()
export class WhitelistStatusService {
    constructor(
        @InjectRepository(WhitelistStatus)
        private whitelistStatusRepository: Repository<WhitelistStatus>,
    ) {}

    async getStatus(): Promise<WhitelistStatus> {
        try {
            let status = await this.whitelistStatusRepository.findOne({ where: { id: 1 } });
            
            if (!status) {
                status = this.whitelistStatusRepository.create({
                    id: 1,
                    isOpen: true,
                    closesAt: null,
                    description: null
                });
                await this.whitelistStatusRepository.save(status);
            }
            
            return status;
        } catch (error) {
            throw new BadRequestException('Erro ao buscar status da whitelist');
        }
    }

    async updateStatus(updateWhitelistStatusDto: UpdateWhitelistStatusDto): Promise<WhitelistStatus> {
        try {
            let status = await this.getStatus();
            
            if (updateWhitelistStatusDto.isOpen !== undefined) {
                status.isOpen = updateWhitelistStatusDto.isOpen;
            }
            
            if (updateWhitelistStatusDto.closesAt !== undefined) {
                status.closesAt = updateWhitelistStatusDto.closesAt ? new Date(updateWhitelistStatusDto.closesAt) : null;
            }
            
            if (updateWhitelistStatusDto.description !== undefined) {
                status.description = updateWhitelistStatusDto.description || null;
            }
            
            return this.whitelistStatusRepository.save(status);
        } catch (error) {
            throw new BadRequestException('Erro ao atualizar status da whitelist');
        }
    }
} 