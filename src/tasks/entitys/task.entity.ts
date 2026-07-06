import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../task.module';
import { UserEntity } from 'src/users/user.entity';
import { TaskLabelEntity } from './task-label.entity';

@Entity({name: 'tasks'})
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
  })
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status!: TaskStatus;
  
  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user!: UserEntity;

  @OneToMany(() => TaskLabelEntity, (label) => label.task, { cascade: true })
  labels!: TaskLabelEntity[];
}
