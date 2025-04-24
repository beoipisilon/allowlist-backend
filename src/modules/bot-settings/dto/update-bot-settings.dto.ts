import { IsOptional, IsString } from 'class-validator';

export class UpdateBotSettingsDto {
    @IsOptional()
    @IsString()
    adminRoleId?: string;

    @IsOptional()
    @IsString()
    modRoleId?: string;

    @IsOptional()
    @IsString()
    supportRoleId?: string;

    @IsOptional()
    @IsString()
    logChannelId?: string;

    @IsOptional()
    @IsString()
    codeLogChannelId?: string;

    @IsOptional()
    @IsString()
    codeErrorChannelId?: string;

    @IsOptional()
    @IsString()
    categoryReviewChannelId?: string;

    @IsOptional()
    @IsString()
    categoryBlockChannelId?: string;

    @IsOptional()
    @IsString()
    logBannedChannelId?: string;
} 