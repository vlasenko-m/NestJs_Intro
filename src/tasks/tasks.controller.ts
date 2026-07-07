import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindOneTaskParams } from './parmams/find-one-task.params';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entitys/task.entity';
import { WrongTaskStatusTransitionException } from './exeptions/wrong-task-status-transition.exeption';
import { TaskLabelDto } from './dto/create-task-lable.dto';
import { FindAllTaskParams } from './parmams/find-all-task.param';
import { PaginationParams } from 'src/common/pagination.params';
import { PaginationResponse } from 'src/common/pagination-response';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query() params: FindAllTaskParams,
    @Query() pagination: PaginationParams,
  ): Promise<PaginationResponse<TaskEntity>> {
    const [items,total] = await this.tasksService.findAll(params, pagination);
    return {
      data: items,
      meta: {
        total,
        offset: pagination.offset,
        limit: pagination.limit,
      },
    }
  }

  @Get(':id')
  async findOne(
    @Param() params: FindOneTaskParams,
  ): Promise<TaskEntity | null> {
    const { id } = params;
    return this.isTaskExists(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  async updateTask(
    @Param() params: FindOneTaskParams,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    try {
      const task = this.isTaskExists(params.id);
      return await this.tasksService.updateTask(await task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusTransitionException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Post(':id/labels')
  async addLabelsToTask(
    @Param() params: FindOneTaskParams,
    @Body() labels: TaskLabelDto[],
  ): Promise<TaskEntity> {
    const task = await this.isTaskExists(params.id);
    return this.tasksService.addLabels(task, labels);
  }

  @Delete(':id/labels')
  async removeLabelsFromTask(
    @Param() params: FindOneTaskParams,
    @Body() labels: TaskLabelDto[],
  ): Promise<void> {
    const task = await this.isTaskExists(params.id);
    await this.tasksService.removeLabels(task, labels);
  }

  async isTaskExists(id: string): Promise<TaskEntity> {
    const task = await this.tasksService.findOne(id);
    if (task) {
      return task;
    } else {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }
}
