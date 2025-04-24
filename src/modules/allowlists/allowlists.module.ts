import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllowlistsService } from './services/allowlists.service';
import { AllowlistsController } from './controllers/allowlists.controller';
import { Allowlist } from './entities/allowlists.entity';
import { AuditModule } from '../audit/audit.module';
import { DiscordModule } from '../discord/discord.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Allowlist]),
        AuditModule,
        DiscordModule
    ],
    controllers: [AllowlistsController],
    providers: [AllowlistsService],
    exports: [AllowlistsService],
})
export class AllowlistsModule {}