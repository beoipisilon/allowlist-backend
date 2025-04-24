import { Entity, Column, PrimaryColumn } from 'typeorm';
import { DiscordProfile } from '../interfaces/discord-profile.interface';

@Entity('sessions')
export class Session {
    @PrimaryColumn()
    id: string;

    @Column('json')
    user: DiscordProfile;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
} 