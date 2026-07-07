import { Transform } from "class-transformer";
import { IsEnum, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { TaskStatus } from "../task.module";

export class FindAllTaskParams {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsString()
    @MinLength(3)
    search?: string;

    @IsOptional()
    @IsString({ each: true })
    @Transform(({ value }: { value?: string }) => {
        if (!value) return undefined;

        return value
            .split(',')
            .map((label) => label.trim())
            .filter((label) => label.length);
    })
    labels?: string[];

        @IsOptional()
    @IsIn(['title', 'description', 'status'])
    sortBy?: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}