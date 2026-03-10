import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { ProjectMembersModule } from '../project-members/project-members.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, ActivityLogsModule, ProjectMembersModule, UploadModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
