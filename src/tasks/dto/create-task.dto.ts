import {IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { TaskStatus } from "../task.module";
import { TaskLabelDto } from "./create-task-lable.dto";
import { Type } from "class-transformer";

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status: TaskStatus;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => TaskLabelDto)
    labels?: TaskLabelDto[];
}