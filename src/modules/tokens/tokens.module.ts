import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tokens } from './entities/tokens.entity';
import { TokensService } from './services/tokens.service';
import { TokensController } from './controllers/tokens.controller';
import { ActionsModule } from '../actions/actions.module';
@Module({
    imports: [TypeOrmModule.forFeature([Tokens]), ActionsModule],
    controllers: [TokensController],
    providers: [TokensService],
})
export class TokensModule {}