import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { IsBoolean, IsOptional } from 'class-validator';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column('int')
  priority: number;

  @Column('varchar', { array: true })
  dependencies: string[];

  @Column('int')
  status: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @IsOptional()
  doable: boolean;
}
