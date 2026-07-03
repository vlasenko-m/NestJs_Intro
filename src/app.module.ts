import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MassageFormaterService } from './massage-formater/massage-formater.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { appConfig } from './config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, typeOrmConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService
      ) => ({
        ...configService.get('database'),
      }),
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, MassageFormaterService, LoggerService],
})
export class AppModule {}
