import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private permissionsService: PermissionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.session.user;

    //console.log('PermissionsGuard - User:', user);
    console.log('PermissionsGuard - User Permission:', user?.permission);

    if (!user) {
      console.log('PermissionsGuard - No user found');
      return false;
    }

    const userPermissions = await this.permissionsService.findByRoleName(user.permission);
    
    if (!userPermissions) {
      console.log('PermissionsGuard - No permissions found for user');
      return false;
    }

    const hasManagePermissions = userPermissions.permissions.manage_permissions === true;    
    return hasManagePermissions;
  }
} 