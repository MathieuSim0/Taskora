import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Vérifie si l'utilisateur a accès au projet (propriétaire ou membre)
   */
  private async checkProjectAccess(projectId: string, userId: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return false;
    }

    // Vérifier si l'utilisateur est le propriétaire
    if (project.userId === userId) {
      return true;
    }

    // Vérifier si l'utilisateur est membre du projet
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return !!member;
  }

  /**
   * Vérifie si l'utilisateur peut modifier le projet (propriétaire ou admin)
   */
  private async checkProjectEditPermission(projectId: string, userId: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return false;
    }

    // Le propriétaire peut toujours modifier
    if (project.userId === userId) {
      return true;
    }

    // Vérifier si l'utilisateur est admin du projet
    const member = await this.prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    return member?.role === 'ADMIN';
  }

  async findAll(userId: string) {
    // Récupérer les projets dont l'utilisateur est propriétaire
    const ownedProjects = await this.prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    // Récupérer les projets dont l'utilisateur est membre
    const memberProjects = await this.prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            _count: {
              select: { tasks: true },
            },
          },
        },
      },
    });

    // Combiner les deux listes
    const allProjects = [
      ...ownedProjects,
      ...memberProjects.map(m => m.project),
    ];

    // Trier par date de création
    return allProjects.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Vérifier l'accès (propriétaire ou membre)
    const hasAccess = await this.checkProjectAccess(id, userId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    // Créer le projet
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        userId,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    // Le créateur devient automatiquement OWNER via la relation userId
    // Pas besoin de créer un ProjectMember pour le propriétaire

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Vérifier les permissions (propriétaire ou admin)
    const canEdit = await this.checkProjectEditPermission(id, userId);
    if (!canEdit) {
      throw new ForbiddenException('You do not have permission to edit this project');
    }

    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Seul le propriétaire peut supprimer le projet
    if (project.userId !== userId) {
      throw new ForbiddenException('Only the project owner can delete this project');
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }

  async getProjectStats(userId: string) {
    // Récupérer les projets dont l'utilisateur est propriétaire
    const ownedProjects = await this.prisma.project.findMany({
      where: { userId },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    // Récupérer les projets dont l'utilisateur est membre
    const memberProjects = await this.prisma.projectMember.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            tasks: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const allProjects = [
      ...ownedProjects,
      ...memberProjects.map(m => m.project),
    ];

    return allProjects.map(project => ({
      id: project.id,
      name: project.name,
      totalTasks: project.tasks.length,
      completedTasks: project.tasks.filter(t => t.status === 'DONE').length,
      inProgressTasks: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      todoTasks: project.tasks.filter(t => t.status === 'TODO').length,
    }));
  }

  async getProjectStatsById(projectId: string, userId: string) {
    // Vérifier l'accès au projet
    const hasAccess = await this.checkProjectAccess(projectId, userId);
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        tasks: {
          select: {
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
          },
        },
        members: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Calculer les statistiques
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;
    const inProgressTasks = project.tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todoTasks = project.tasks.filter(t => t.status === 'TODO').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tâches par priorité
    const tasksByPriority = {
      LOW: project.tasks.filter(t => t.priority === 'LOW').length,
      MEDIUM: project.tasks.filter(t => t.priority === 'MEDIUM').length,
      HIGH: project.tasks.filter(t => t.priority === 'HIGH').length,
      URGENT: project.tasks.filter(t => t.priority === 'URGENT').length,
    };

    // Tâches en retard
    const now = new Date();
    const overdueTasks = project.tasks.filter(
      t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE'
    ).length;

    // Progression sur 7 derniers jours
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const progressionData = last7Days.map(date => {
      const tasksCompletedOnDate = project.tasks.filter(t => {
        const taskDate = new Date(t.createdAt).toISOString().split('T')[0];
        return taskDate === date && t.status === 'DONE';
      }).length;

      return {
        date,
        completed: tasksCompletedOnDate,
      };
    });

    return {
      project: {
        id: project.id,
        name: project.name,
        owner: project.user.name,
      },
      overview: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionRate,
        overdueTasks,
        totalMembers: project.members.length + 1, // +1 pour le owner
      },
      tasksByStatus: {
        TODO: todoTasks,
        IN_PROGRESS: inProgressTasks,
        DONE: completedTasks,
      },
      tasksByPriority,
      progression: progressionData,
    };
  }
}
