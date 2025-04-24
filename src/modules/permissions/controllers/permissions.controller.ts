import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { PermissionsService } from '../services/permissions.service';
import { CreatePermissionDto, UpdatePermissionDto, PermissionData } from '../interfaces/permission.interface';
import { Request } from 'express';
import { PermissionGuard } from '../guards/permission.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { DiscordAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

@Controller('permissions')
@UseGuards(DiscordAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @UseGuards(AdminGuard)
  @RequirePermissions('view_permissions')
  async findAll(): Promise<PermissionData[]> {
    return this.permissionsService.findAll();
  }

  @Get('roles')
  @UseGuards(AdminGuard)
  async getDefaultRoles(): Promise<any[]> {
    console.log('Getting default roles');
    const roles = await this.permissionsService.getDefaultRoles();
   // console.log('Default roles:', roles);
    return roles;
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @RequirePermissions('view_permissions')
  async findOne(@Param('id') id: string): Promise<PermissionData> {
    console.log('Finding permission by id:', id);
    return this.permissionsService.findOne(+id);
  }

  @Get('role/:roleName')
  @RequirePermissions('view_permissions')
  async findByRoleName(@Param('roleName') roleName: string): Promise<PermissionData | null> {
    console.log('Finding permission by role name:', roleName);
    const normalizedRoleName = roleName.toLowerCase();
    return this.permissionsService.findByRoleName(normalizedRoleName);
  }

  @Post()
  @RequirePermissions('manage_permissions')
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<PermissionData> {
    console.log('Creating permission:', createPermissionDto);
    return this.permissionsService.create(createPermissionDto);
  }

  @Patch(':id')
  @RequirePermissions('manage_permissions')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionData> {
    console.log('Updating permission:', id, updatePermissionDto);
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Put('roles/:roleName')
  @RequirePermissions('manage_permissions')
  async updateRolePermissions(
    @Param('roleName') roleName: string,
    @Body() permissions: Record<string, boolean>,
    @Req() req: Request,
  ): Promise<PermissionData> {
    console.log('Updating permissions for role:', roleName);
    console.log('New permissions:', permissions);
    
    const normalizedRoleName = roleName.toLowerCase();
    const existingPermission = await this.permissionsService.findByRoleName(normalizedRoleName);
    
    console.log('existingPermission', existingPermission)
    if (existingPermission && existingPermission.id) {
      console.log('Updating existing permission');
      return this.permissionsService.update(existingPermission.id, permissions);
    } else {
      console.log('Creating new permission');
      return this.permissionsService.create({ roleName: normalizedRoleName, permissions });
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @RequirePermissions('manage_permissions')
  async remove(@Param('id') id: string): Promise<void> {
    return this.permissionsService.remove(+id);
  }

  @Get('user/permissions')
  async getUserPermissions(@Req() req: Request): Promise<Record<string, boolean> | null> {
    const user = req.session.user as any;
    if (!user || !user.permission) {
      return null;
    }
    
    return this.permissionsService.getPermissionsByRole(user.permission);
  }
} 