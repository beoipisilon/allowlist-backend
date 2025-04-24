import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bot_settings')
export class BotSettings {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    adminRoleId: string;

    @Column({ nullable: true })
    modRoleId: string;

    @Column({ nullable: true })
    supportRoleId: string;

    @Column({ nullable: true })
    logChannelId: string;

    @Column({ nullable: true })
    codeLogChannelId: string;

    @Column({ nullable: true })
    codeErrorChannelId: string;
    
    @Column({ nullable: true })
    logBannedChannelId: string;

    @Column({ nullable: true })
    categoryReviewChannelId: string;

    @Column({ nullable: true })
    categoryBlockChannelId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
} 