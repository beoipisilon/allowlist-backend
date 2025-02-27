import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 }) 
  user: string;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 100 }) 
  target: string;

  @CreateDateColumn({ type: 'timestamp' }) 
  createdAt: Date;
}