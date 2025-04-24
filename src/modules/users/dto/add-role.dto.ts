import { IsString, IsNotEmpty } from 'class-validator';

export class AddRoleDto {
    @IsString()
    @IsNotEmpty()
    discordId: string;

    @IsString()
    @IsNotEmpty()
    roleName: string;
} 