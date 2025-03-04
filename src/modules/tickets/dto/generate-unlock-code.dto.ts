import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateUnlockCodeDto {
    @IsNotEmpty()
    @IsString()
    ticketId: string;
}
