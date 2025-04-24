import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class WhitelistQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: 'text' })
    type: string;

    @Column({ default: true })
    required: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
} 