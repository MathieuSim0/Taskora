import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectMembersService } from './project-members.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  /**
   * POST /api/projects/:projectId/members/invite
   * Invite un nouveau membre au projet
   */
  @Post(':projectId/members/invite')
  async inviteMember(
    @Param('projectId') projectId: string,
    @Request() req,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.projectMembersService.inviteMember(
      projectId,
      req.user.id,
      inviteMemberDto,
    );
  }

  /**
   * GET /api/projects/:projectId/members
   * Récupère tous les membres du projet
   */
  @Get(':projectId/members')
  async getProjectMembers(@Param('projectId') projectId: string, @Request() req) {
    return this.projectMembersService.getProjectMembers(
      projectId,
      req.user.id,
    );
  }

  /**
   * PATCH /api/projects/:projectId/members/:memberId
   * Met à jour le rôle d'un membre
   */
  @Patch(':projectId/members/:memberId')
  async updateMember(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Request() req,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.projectMembersService.updateMember(
      projectId,
      memberId,
      req.user.id,
      updateMemberDto,
    );
  }

  /**
   * DELETE /api/projects/:projectId/members/:memberId
   * Supprime un membre du projet
   */
  @Delete(':projectId/members/:memberId')
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @Param('projectId') projectId: string,
    @Param('memberId') memberId: string,
    @Request() req,
  ) {
    return this.projectMembersService.removeMember(
      projectId,
      memberId,
      req.user.id,
    );
  }

  /**
   * POST /api/projects/:projectId/members/leave
   * Permet à un membre de quitter le projet
   */
  @Post(':projectId/members/leave')
  @HttpCode(HttpStatus.OK)
  async leaveProject(@Param('projectId') projectId: string, @Request() req) {
    return this.projectMembersService.leaveProject(projectId, req.user.id);
  }
}
