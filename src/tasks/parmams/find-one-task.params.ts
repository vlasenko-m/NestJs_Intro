import { IsString, IsUUID } from "class-validator";

export class FindOneTaskParams {
    @IsString()
    @IsUUID()
    id!: string;
}