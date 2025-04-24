import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class InitPermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async initializePermissions() {
    // Verifica se já existem permissões no banco de dados
    const existingPermissions = await this.permissionRepository.find();
    if (existingPermissions.length > 0) {
      console.log('Permissions already initialized');
      return;
    }

    // Define as permissões padrão para cada cargo
    const defaultPermissions = [
      {
        roleName: 'administrador',
        permissions: {
          view_permissions: true,
          manage_permissions: true,
          view_users: true,
          manage_users: true,
          view_allowlists: true,
          manage_allowlists: true,
          view_allowlists_questions: true,
          manage_allowlists_questions: true,
          view_tickets: true,
          manage_tickets: true,
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
        roleName: 'moderador',
        permissions: {
          view_permissions: false,
          manage_permissions: false,
          view_users: true,
          manage_users: false,
          view_allowlists: true,
          manage_allowlists: true,
          view_allowlists_questions: false,
          manage_allowlists_questions: false,
          view_tickets: true,
          manage_tickets: true,
          view_audit: false,
          view_tokens: false,
          manage_tokens: false,
          view_dashboard: true,
          view_configuration: false,
          manage_configuration: false,
          view_bot_settings: false,
          manage_bot_settings: false,
        },
      },
      {
        roleName: 'suporte',
        permissions: {
          view_permissions: false,
          manage_permissions: false,
          view_users: true,
          manage_users: false,
          view_allowlists: true,
          manage_allowlists: false,
          view_allowlists_questions: false,
          manage_allowlists_questions: false,
          view_tickets: true,
          manage_tickets: true,
          view_audit: false,
          view_tokens: false,
          manage_tokens: false,
          view_dashboard: true,
          view_configuration: false,
          manage_configuration: false,
          view_bot_settings: false,
          manage_bot_settings: false,
        },
      },
      {
        roleName: 'user',
        permissions: {
          view_permissions: false,
          manage_permissions: false,
          view_users: false,
          manage_users: false,
          view_allowlists: false,
          manage_allowlists: false,
          view_allowlists_questions: false,
          manage_allowlists_questions: false,
          view_tickets: false,
          manage_tickets: false,
          view_audit: false,
          view_tokens: false,
          manage_tokens: false,
          view_dashboard: false,
          view_configuration: false,
          manage_configuration: false,
          view_bot_settings: false,
          manage_bot_settings: false,
        },
      },
    ];

    // Salva as permissões no banco de dados
    for (const permission of defaultPermissions) {
      await this.permissionRepository.save(permission);
    }

    console.log('Permissions initialized successfully');
  }
} 