import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InviteMemberDto, ProjectRole } from './dto/invite-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class ProjectMembersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Vérifie si l'utilisateur a un rôle spécifique dans le projet
   */
  async checkMemberRole(
    projectId: string,
    userId: string,
    requiredRoles: ProjectRole[],
  ): Promise<boolean> {
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!member) {
      return false;
    }

    return requiredRoles.includes(member.role as ProjectRole);
  }

  /**
   * Vérifie si l'utilisateur est le propriétaire du projet
   */
  async isProjectOwner(projectId: string, userId: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    return project?.userId === userId;
  }

  /**
   * Vérifie les permissions (propriétaire ou membre avec rôle spécifique)
   */
  async verifyPermission(
    projectId: string,
    userId: string,
    requiredRoles: ProjectRole[],
  ): Promise<void> {
    const isOwner = await this.isProjectOwner(projectId, userId);
    if (isOwner) return;

    const hasMemberRole = await this.checkMemberRole(
      projectId,
      userId,
      requiredRoles,
    );
    if (hasMemberRole) return;

    throw new ForbiddenException(
      'You do not have permission to perform this action',
    );
  }

  /**
   * Vérifie si l'utilisateur a accès au projet (propriétaire ou membre)
   */
  async checkProjectAccess(userId: string, projectId: string): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Vérifier si l'utilisateur est le propriétaire
    if (project.userId === userId) {
      return;
    }

    // Vérifier si l'utilisateur est membre
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException('You do not have access to this project');
    }
  }

  /**
   * Invite un membre au projet par email
   */
  async inviteMember(
    projectId: string,
    inviterId: string,
    inviteMemberDto: InviteMemberDto,
  ) {
    // Vérifier que le projet existe
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Vérifier les permissions (OWNER ou ADMIN peuvent inviter)
    await this.verifyPermission(projectId, inviterId, [
      ProjectRole.OWNER,
      ProjectRole.ADMIN,
    ]);

    // Ne pas autoriser l'assignation du rôle OWNER via invitation
    if (inviteMemberDto.role === ProjectRole.OWNER) {
      throw new BadRequestException(
        'Cannot assign OWNER role through invitation',
      );
    }

    // Trouver l'utilisateur par email
    const userToInvite = await this.prisma.user.findUnique({
      where: { email: inviteMemberDto.email },
    });

    if (!userToInvite) {
      throw new NotFoundException('User with this email not found');
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    const existingMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userToInvite.id,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this project');
    }

    // Vérifier que l'utilisateur n'est pas le propriétaire
    if (project.userId === userToInvite.id) {
      throw new ConflictException('User is already the owner of this project');
    }

    // Créer le membre
    const member = await this.prisma.projectMember.create({
      data: {
        projectId,
        userId: userToInvite.id,
        role: inviteMemberDto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return member;
  }

  /**
   * Récupère tous les membres d'un projet
   */
  async getProjectMembers(projectId: string, userId: string) {
    // Vérifier que le projet existe
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Vérifier que l'utilisateur a accès au projet
    const isOwner = await this.isProjectOwner(projectId, userId);
    const isMember = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this project');
    }

    // Récupérer les membres
    const members = await this.prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Ajouter le propriétaire en premier
    const ownerMember = {
      id: `owner-${project.userId}`,
      projectId: project.id,
      userId: project.userId,
      role: ProjectRole.OWNER,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      user: await this.prisma.user.findUnique({
        where: { id: project.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      }),
    };

    return [ownerMember, ...members];
  }

  /**
   * Met à jour le rôle d'un membre
   */
  async updateMember(
    projectId: string,
    memberId: string,
    userId: string,
    updateMemberDto: UpdateMemberDto,
  ) {
    // Vérifier les permissions (OWNER ou ADMIN)
    await this.verifyPermission(projectId, userId, [
      ProjectRole.OWNER,
      ProjectRole.ADMIN,
    ]);

    // Trouver le membre
    const member = await this.prisma.projectMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.projectId !== projectId) {
      throw new NotFoundException('Member not found');
    }

    // Ne pas autoriser la modification du rôle OWNER
    if (updateMemberDto.role === ProjectRole.OWNER) {
      throw new BadRequestException('Cannot assign OWNER role to members');
    }

    // Mettre à jour le membre
    return this.prisma.projectMember.update({
      where: { id: memberId },
      data: updateMemberDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  /**
   * Supprime un membre du projet
   */
  async removeMember(projectId: string, memberId: string, userId: string) {
    // Vérifier les permissions (OWNER ou ADMIN)
    await this.verifyPermission(projectId, userId, [
      ProjectRole.OWNER,
      ProjectRole.ADMIN,
    ]);

    // Trouver le membre
    const member = await this.prisma.projectMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.projectId !== projectId) {
      throw new NotFoundException('Member not found');
    }

    // Supprimer le membre
    await this.prisma.projectMember.delete({
      where: { id: memberId },
    });

    return { message: 'Member removed successfully' };
  }

  /**
   * Quitter un projet (pour le membre lui-même)
   */
  async leaveProject(projectId: string, userId: string) {
    // Vérifier que l'utilisateur n'est pas le propriétaire
    const isOwner = await this.isProjectOwner(projectId, userId);
    if (isOwner) {
      throw new BadRequestException('Project owner cannot leave the project');
    }

    // Trouver le membre
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('You are not a member of this project');
    }

    // Supprimer le membre
    await this.prisma.projectMember.delete({
      where: { id: member.id },
    });

    return { message: 'You have left the project' };
  }
}
