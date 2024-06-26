import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional } from 'class-validator';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'date' })
  duedate: string;

  @Column('int')
  priority: number;

  @Column('varchar', { array: true })
  dependencies: string[];

  @IsOptional()
  @Column('varchar', { array: true })
  subtasks: string[];

  @Column('int')
  status: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @IsOptional()
  doable: boolean;
}
