import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateWhitelistQuestionDto {
    @IsString()
    @IsOptional()
    text?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    type?: string;

    @IsBoolean()
    @IsOptional()
    required?: boolean;
} 