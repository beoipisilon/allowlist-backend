import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tokens {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    type: string;

    @Column({ default: 0 })
    uses: number;

    @Column({ default: 1 })
    maxUses: number;

    @Column()
    discordId: string;

    @Column()
    usedBy: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP + INTERVAL 1 DAY' })
    expiresAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}