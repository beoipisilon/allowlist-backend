import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { PermissionData, CreatePermissionDto, UpdatePermissionDto } from '../interfaces/permission.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<PermissionData[]> {
    const permissions = await this.permissionRepository.find();
    return permissions;
  }

  async findOne(id: number): Promise<PermissionData> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  async findByRoleName(roleName: string): Promise<PermissionData | null> {
    console.log('Finding permission for role:', roleName);
    // Normaliza o nome do cargo para minúsculas
    const normalizedRoleName = roleName.toLowerCase();
    const permission = await this.permissionRepository.findOne({ where: { roleName: normalizedRoleName } });
    return permission;
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<PermissionData> {
    console.log('Creating new permission:', createPermissionDto);
    // Normaliza o nome do cargo para minúsculas
    const normalizedRoleName = createPermissionDto.roleName.toLowerCase();
    const existingPermission = await this.findByRoleName(normalizedRoleName);
    
    if (existingPermission && existingPermission.id) {
      console.log('Permission already exists, updating instead');
      return this.update(existingPermission.id, createPermissionDto.permissions);
    }
    
    const permission = this.permissionRepository.create({
      roleName: normalizedRoleName,
      permissions: createPermissionDto.permissions,
    });
    const savedPermission = await this.permissionRepository.save(permission);
    console.log('Created new permission:', savedPermission);
    return savedPermission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<PermissionData> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    // Substituir completamente as permissões antigas pelas novas
    permission.permissions = { ...updatePermissionDto };
    
    const updatedPermission = await this.permissionRepository.save(permission);
    
    // Atualiza as permissões de todos os usuários que têm esse cargo
    await this.authService.updateUserPermissionsByRole(permission.roleName);
    
    return this.mapToPermissionData(updatedPermission);
  }

  async remove(id: number): Promise<void> {
    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }

  async getPermissionsByRole(roleName: string): Promise<Record<string, boolean> | null> {
    // Normaliza o nome do cargo para minúsculas
    const normalizedRoleName = roleName.toLowerCase();
    const permission = await this.findByRoleName(normalizedRoleName);
    return permission ? permission.permissions : null;
  }

  async getDefaultRoles(): Promise<any[]> {
    // Define os cargos padrão
    const defaultRoles = [
      {
        id: 'administrador',
        name: 'Administrador',
        color: '#E74C3C',
        permissions: {
          view_permissions: true,
          manage_permissions: true,
          view_users: true,
          manage_users: true,
          view_allowlists: true,
          manage_allowlists: true,
          view_tickets: true,
          manage_tickets: true,
          view_allowlists_questions: true,
          manage_allowlists_questions: true,
          view_tokens: true,
          manage_tokens: true,
          view_audit: true,
          view_dashboard: true,
          view_configuration: true,
          manage_configuration: true,
          view_bot_settings: true,
          manage_bot_settings: true,
        },
      },
      {
        id: 'moderador',
        name: 'Moderador',
        color: '#3498DB',
        permissions: {
          view_permissions: false,
          manage_permissions: false,
          view_users: true,
          manage_users: false,
          view_allowlists: true,
          manage_allowlists: true,
          view_tickets: true,
          manage_tickets: true,
          view_allowlists_questions: true,
          manage_allowlists_questions: true,
          view_tokens: true,
          manage_tokens: false,
          view_audit: true,
          view_dashboard: true,
          view_configuration: false,
          manage_configuration: false,
          view_bot_settings: false,
          manage_bot_settings: false,
        },
      },
      {
        id: 'suporte',
        name: 'Suporte',
        color: '#2ECC71',
        permissions: {
          view_permissions: false,
          manage_permissions: false,
          view_users: true,
          manage_users: false,
          view_allowlists: true,
          manage_allowlists: false,
          view_tickets: true,
          manage_tickets: true,
          view_allowlists_questions: true,
          manage_allowlists_questions: false,
          view_tokens: true,
          manage_tokens: false,
          view_audit: true,
          view_dashboard: true,
          view_configuration: false,
          manage_configuration: false,
          view_bot_settings: false,
          manage_bot_settings: false,
        },
      },
    ];

    // Busca as permissões salvas no banco de dados
    const savedPermissions = await this.permissionRepository.find();
    // Atualiza as permissões padrão com as permissões salvas
    return defaultRoles.map(role => {
      const savedPermission = savedPermissions.find(p => p.roleName.toLowerCase() === role.id.toLowerCase());
      if (savedPermission) {
        console.log('Saved permission found:', role.id.toLowerCase());
        return {
          ...role,
          permissions: savedPermission.permissions,
        };
      }
      console.log('No saved permission found for role:', role);
      return role;
    });
  }

  private mapToPermissionData(permission: Permission): PermissionData {
    return {
      id: permission.id,
      roleName: permission.roleName,
      permissions: permission.permissions,
      isActive: permission.isActive,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
} 