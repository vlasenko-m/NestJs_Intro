import * as Joi from "joi";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AppConfig } from "./app.config";


export interface ConfigType{ 
    app: AppConfig; 
    database: TypeOrmModuleOptions;
}

export const appConfigSchema = Joi.object({
MESSAGE_PREFIX : "may app",
DB_USERNAME :Joi.string().default("postgres").required(),
DB_PASSWORD : Joi.string().default("postgres").required(),
DB_NAME : Joi.string().default("tasks").required(),
DB_HOST :   Joi.string().default("localhost").required(),
DB_PORT : Joi.number().default(5432).required(),
DB_SYNC: Joi.boolean().default(false).required(),
});