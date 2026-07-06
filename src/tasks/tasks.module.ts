import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entitys/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLabelEntity } from './entitys/task-label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity , TaskLabelEntity])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
