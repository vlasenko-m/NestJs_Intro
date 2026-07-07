import { IsEnum, IsNotEmpty } from "class-validator";
import { TaskStatus } from "../task.module";

export class UpdateStatusDto {
    @IsNotEmpty()
    @IsEnum(TaskStatus)
    status!: TaskStatus;
}
