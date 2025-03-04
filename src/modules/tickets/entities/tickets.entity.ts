import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    discordId: string;

    @Column()
    channelId: string;

    @Column()
    reason: string;

    @Column()
    status: string;

    @Column()
    ticketType: string;

    @Column()
    messageId: string;

    @Column()
    generatedToken: boolean;

    @Column()
    token: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}