import { Module, OnModuleInit, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsService } from './services/permissions.service';
import { PermissionsController } from './controllers/permissions.controller';
import { Permission } from './entities/permission.entity';
import { PermissionGuard } from './guards/permission.guard';
import { InitPermissionsService } from './scripts/init-permissions';
import { PermissionsGuard } from './guards/permissions.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionGuard, InitPermissionsService, PermissionsGuard],
  exports: [PermissionsService, PermissionGuard, PermissionsGuard],
})
export class PermissionsModule implements OnModuleInit {
  constructor(private readonly initPermissionsService: InitPermissionsService) {}

  async onModuleInit() {
    try {
      await this.initPermissionsService.initializePermissions();
    } catch (error) {
      console.error('Error initializing permissions:', error);
    }
  }
} 