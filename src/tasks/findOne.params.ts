import { IsString, IsUUID } from "class-validator";

export class FindOneParams {
    @IsString()
    @IsUUID()
    id!: string;
}