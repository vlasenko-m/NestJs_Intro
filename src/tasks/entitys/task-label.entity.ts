import { Column, CreateDateColumn, Entity, In, Index, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { TaskEntity } from "./task.entity";

@Entity({name: 'task_labels'})
@Unique(['taskId', 'name']) 
export class TaskLabelEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;  

    @Column()
    @Index()
    taskId!: string;

    @ManyToOne(() => TaskEntity, (task) => task.labels)
    task!: TaskEntity;

    @CreateDateColumn()
    createdAt!: Date;
    
    @CreateDateColumn()
    updatedAt!: Date;   
}