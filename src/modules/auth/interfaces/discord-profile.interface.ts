export interface DiscordProfile {
    id: string;
    username: string;
    avatar: string;
    permission?: string;
    permissions?: Record<string, boolean>;
}