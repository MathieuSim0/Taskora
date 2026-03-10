import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectMembersService } from '../project-members/project-members.service';
import { ProjectRole } from '../project-members/dto/invite-member.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ActivityLogsController {
  constructor(
    private readonly activityLogsService: ActivityLogsService,
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  @Get(':projectId/logs')
  async getProjectLogs(
    @Param('projectId') projectId: string,
    @Query('limit') limit?: string,
    @Request() req?: any,
  ) {
    // Vérifier que l'utilisateur est OWNER ou ADMIN du projet
    await this.projectMembersService.verifyPermission(
      projectId,
      req.user.id,
      [ProjectRole.OWNER, ProjectRole.ADMIN],
    );

    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.activityLogsService.getProjectLogs(projectId, limitNum);
  }
}
