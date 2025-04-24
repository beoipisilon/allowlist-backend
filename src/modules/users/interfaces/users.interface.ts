export interface UsersDashboard {
    id: string;
    discordId: string;
    username: string;
    avatarUrl: string | null;
    permission: 'administrador' | 'moderador' | 'suporte' | 'user';
}