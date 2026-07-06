import { IsNotEmpty, IsString } from "class-validator";

export class TaskLabelDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
}