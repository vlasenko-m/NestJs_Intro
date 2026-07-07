import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { WrongTaskStatusTransitionException } from './exeptions/wrong-task-status-transition.exeption';
import { Repository } from 'typeorm';
import { TaskEntity } from './entitys/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabelEntity } from './entitys/task-label.entity';
import { TaskLabelDto } from './dto/create-task-lable.dto';
import { FindAllTaskParams } from './parmams/find-all-task.param';
import { FindOneTaskParams } from './parmams/find-one-task.params';
import { PaginationParams } from 'src/common/pagination.params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskLabelEntity)
    private readonly labelRepository: Repository<TaskLabelEntity>,
  ) {}

  async findAll(params: FindAllTaskParams, pagination: PaginationParams): Promise<[TaskEntity[], number]> {
    const { status, search, labels } = params;

    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels')
      .skip(pagination.offset)
      .take(pagination.limit);

      query.orderBy(`task.${params.sortBy || 'createdAt'}`, params.sortOrder || 'ASC');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (labels?.length) {
      const subQuery = query
        .subQuery()
        .select('label.taskId')
        .from('task_labels', 'label')
        .where('label.name IN (:...labels)', { labels })
        .getQuery();

      query.andWhere(`task.id IN ${subQuery}`);
    }

    return await query.getManyAndCount();
  }

  // Альтернатива через findAndCount + объект/массив where.
  // Чтобы включить: раскомментируй, переименуй в findAll (убрав активный
  // вариант выше) и верни импорты Like, FindOptionsWhere из 'typeorm'.
  //
  // async findAllWithFindAndCount(
  //   params: FindAllTaskParams,
  //   pagination: PaginationParams,
  // ): Promise<[TaskEntity[], number]> {
  //   const { status, search } = params;
  //
  //   let where: FindOptionsWhere<TaskEntity> | FindOptionsWhere<TaskEntity>[] = {};
  //
  //   if (status) {
  //     where.status = status;
  //   }
  //
  //   if (search) {
  //     where = [
  //       { title: Like(`%${search}%`) },
  //       { description: Like(`%${search}%`) },
  //     ];
  //   }
  //
  //   return await this.taskRepository.findAndCount({
  //     where,
  //     relations: { labels: true },
  //     skip: pagination.offset,
  //     take: pagination.limit,
  //   });
  // }

  async findOne(id: string): Promise<TaskEntity | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: { labels: true },
    });
  }

  async create(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    if (createTaskDto.labels) {
      createTaskDto.labels = this.getUniqueLabels(createTaskDto.labels);
    }
    return await this.taskRepository.save(createTaskDto);
  }

  async updateTask(
    task: TaskEntity,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusTransitionException(
        `Invalid status transition from ${task.status} to ${updateTaskDto.status}`,
      );
    }

    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }

    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async addLabels(
    task: TaskEntity,
    labelDtos: TaskLabelDto[],
  ): Promise<TaskEntity> {
    const names = new Set(task.labels.map((label) => label.name));

    const labels = this.getUniqueLabels(labelDtos)
      .filter((label) => !names.has(label.name))
      .map((label) => this.labelRepository.create(label));

    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepository.save(task);
    }
    return task;
  }

  async removeLabels(
    task: TaskEntity,
    labelDtos: TaskLabelDto[],
  ): Promise<TaskEntity> {
    const namesToRemove = new Set(labelDtos.map((label) => label.name));
    task.labels = task.labels.filter((label) => !namesToRemove.has(label.name));
    return await this.taskRepository.save(task);
  }

  isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
    const statusOrder = ['OPEN', 'IN_PROGRESS', 'DONE'];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  getUniqueLabels(labelDtos: TaskLabelDto[]): TaskLabelDto[] {
    const uniqueLables = [...new Set(labelDtos.map((label) => label.name))];
    return uniqueLables.map((name) => ({ name }));
  }
}
