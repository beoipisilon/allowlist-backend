export interface PermissionData {
  id?: number;
  roleName: string;
  permissions: Record<string, boolean>;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UpdatePermissionDto = Record<string, boolean>;

export interface CreatePermissionDto {
  roleName: string;
  permissions: Record<string, boolean>;
} 