import { TaskEntity } from "src/tasks/entitys/task.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;
    
    // @Column()
    // password!: string;  

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
    

    @OneToMany(() => TaskEntity, (task) => task.user)   
    tasks!: TaskEntity[];
}