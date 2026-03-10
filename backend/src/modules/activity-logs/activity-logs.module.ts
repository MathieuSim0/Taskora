import { Module } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProjectMembersModule } from '../project-members/project-members.module';

@Module({
  imports: [PrismaModule, ProjectMembersModule],
  controllers: [ActivityLogsController],
  providers: [ActivityLogsService],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
