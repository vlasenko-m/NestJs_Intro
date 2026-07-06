import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WrongTaskStatusTransitionException } from './exeptions/wrong-task-status-transition.exeption';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {

constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>
) {}

 async findAll(): Promise<TaskEntity[]> {
    return await this.taskRepository.find();
  }

  async findOne(id: string): Promise<TaskEntity | null> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.taskRepository.save(createTaskDto)
  }

  async updateTask(task: TaskEntity, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {

    if(updateTaskDto.status && !this.isValidStatusTransition(task.status, updateTaskDto.status)) {

    throw new WrongTaskStatusTransitionException(`Invalid status transition from ${task.status} to ${updateTaskDto.status}`);
  }
  Object.assign(task, updateTaskDto);
  return await this.taskRepository.save(task);
}

  isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const statusOrder = ['OPEN', 'IN_PROGRESS', 'DONE'];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }
}
