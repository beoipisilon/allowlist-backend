import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersDashboard } from './entities/users.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { DiscordModule } from '../discord/discord.module';
import { AuthModule } from '../auth/auth.module';
import { ActionsModule } from '../actions/actions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersDashboard]),
        DiscordModule,
        ActionsModule,
        forwardRef(() => AuthModule),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule.forFeature([UsersDashboard])], 
})
export class UsersModule {}