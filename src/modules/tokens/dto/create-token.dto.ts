export class CreateTokenDto {
    token: string;
    type: string;
    uses: number;
    maxUses: number;
    discordId: string;
    usedBy?: string;
    expiresAt: Date;
}