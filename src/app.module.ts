import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AllowlistsModule } from './modules/allowlists/allowlists.module';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoggingMiddleware } from './common/middlewares/logging.middleware';
import { TokensModule } from './modules/tokens/tokens.module';
import { UsersModule } from './modules/users/users.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { BotSettingsModule } from './modules/bot-settings/bot-settings.module';
import { DiscordModule } from './modules/discord/discord.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuditLog } from './modules/audit/entities/audit-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BotSettings } from './modules/bot-settings/entities/bot-settings.entity';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { Permission } from './modules/permissions/entities/permission.entity';
import { WhitelistQuestionsModule } from './modules/whitelist-questions/whitelist-questions.module';
import { WhitelistQuestion } from './modules/whitelist-questions/entities/whitelist-questions.entity';
import { WhitelistStatus } from './modules/whitelist-questions/entities/whitelist-status.entity';

@Module({
  imports: [
    DatabaseModule, 
    DashboardModule, 
    AuthModule, 
    AllowlistsModule, 
    TokensModule, 
    UsersModule, 
    TicketsModule, 
    BotSettingsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'cfxre',
      entities: [AuditLog, BotSettings, Permission, WhitelistQuestion, WhitelistStatus],
      synchronize: process.env.NODE_ENV !== 'production',
      charset: 'utf8mb4',
      dropSchema: false,
      logging: true,
    }),
    DiscordModule,
    AuditModule,
    PermissionsModule,
    WhitelistQuestionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'DATA_SOURCE',
      useFactory: async (dataSource: DataSource) => {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
        return dataSource;
      },
      inject: [DataSource],
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*'); 
  }
}