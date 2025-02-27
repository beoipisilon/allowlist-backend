import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/actions.entity';
import { ActionsService } from './services/actions.service';

@Module({
    imports: [TypeOrmModule.forFeature([Action])],
    providers: [ActionsService],
    exports: [ActionsService],
})
export class ActionsModule {}