import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 15 })
  username: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'varchar' })
  password: string;
}
