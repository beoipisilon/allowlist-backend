import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WhitelistStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    isOpen: boolean;

    @Column({ type: 'timestamp', nullable: true })
    closesAt: Date | null;

    @Column({ nullable: true, type: 'text' })
    description: string | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
} 