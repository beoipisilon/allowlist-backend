import { IsString, IsNotEmpty } from 'class-validator';

export class RemoveRoleDto {
    @IsString()
    @IsNotEmpty()
    discordId: string;

    @IsString()
    @IsNotEmpty()
    roleName: string;
} 