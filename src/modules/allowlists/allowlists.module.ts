import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allowlist } from './entities/allowlists.entity';
import { AllowlistsService } from './services/allowlists.service';
import { AllowlistsController } from './controllers/allowlists.controller';
import { DiscordModule } from '../discord/discord.module';
import { AuthModule } from '../auth/auth.module';
import { ActionsModule } from '../actions/actions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Allowlist]), DiscordModule, AuthModule, ActionsModule],
  controllers: [AllowlistsController],
  providers: [AllowlistsService],
})
export class AllowlistsModule {}