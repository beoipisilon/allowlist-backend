import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhitelistQuestion } from './entities/whitelist-questions.entity';
import { WhitelistStatus } from './entities/whitelist-status.entity';
import { WhitelistQuestionsService } from './services/whitelist-questions.service';
import { WhitelistStatusService } from './services/whitelist-status.service';
import { WhitelistQuestionsController } from './controllers/whitelist-questions.controller';
import { WhitelistStatusController } from './controllers/whitelist-status.controller';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([WhitelistQuestion, WhitelistStatus]),
        AuditModule,
        AuthModule,
        PermissionsModule
    ],
    controllers: [WhitelistQuestionsController, WhitelistStatusController],
    providers: [WhitelistQuestionsService, WhitelistStatusService],
    exports: [WhitelistQuestionsService, WhitelistStatusService],
})
export class WhitelistQuestionsModule {} 