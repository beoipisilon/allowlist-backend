export class CreateTokenDto {
    token: string;
    type: string;
    uses: number;
    maxUses: number;
    discordId: string;
    discordRole: string;
    usedBy?: string;
    expiresAt: Date;
}