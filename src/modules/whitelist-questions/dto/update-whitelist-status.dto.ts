import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateWhitelistStatusDto {
    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;

    @IsString()
    @IsOptional()
    closesAt?: string;

    @IsString()
    @IsOptional()
    description?: string;
} 