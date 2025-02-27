import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Allowlist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @Column()
    question1: string;

    @Column()
    question2: string;

    @Column()
    question3: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}