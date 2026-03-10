import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectMembersModule } from './modules/project-members/project-members.module';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { TaskCommentsModule } from './modules/task-comments/task-comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TasksModule,
    ProjectsModule,
    ProjectMembersModule,
    ActivityLogsModule,
    TaskCommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
