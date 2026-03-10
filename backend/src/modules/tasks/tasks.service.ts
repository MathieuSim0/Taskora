import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ProjectMembersService } from '../project-members/project-members.service';
import { ProjectRole } from '../project-members/dto/invite-member.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private activityLogsService: ActivityLogsService,
    private projectMembersService: ProjectMembersService,
    private uploadService: UploadService,
  ) {}

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllByUser(userId: string) {
    // Récupérer les projets où l'utilisateur est membre ou owner
    const userProjects = await this.prisma.project.findMany({
      where: {
        OR: [
          { userId }, // Projets créés par l'utilisateur
          { members: { some: { userId } } }, // Projets où l'utilisateur est membre
        ],
      },
      select: { id: true },
    });

    const projectIds = userProjects.map(p => p.id);

    // Récupérer les tâches créées par l'utilisateur OU dans ses projets
    return this.prisma.task.findMany({
      where: {
        OR: [
          { userId }, // Tâches créées par l'utilisateur
          { projectId: { in: projectIds } }, // Tâches dans les projets de l'utilisateur
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto & { userId: string }) {
    // Si la tâche est liée à un projet, vérifier les permissions
    if (createTaskDto.projectId) {
      const isOwner = await this.projectMembersService.isProjectOwner(
        createTaskDto.projectId,
        createTaskDto.userId,
      );
      const isMember = await this.prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: createTaskDto.projectId,
            userId: createTaskDto.userId,
          },
        },
      });

      if (!isOwner && !isMember) {
        throw new ForbiddenException('You must be a member of this project to create tasks');
      }
    }

    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate,
        projectId: createTaskDto.projectId,
        userId: createTaskDto.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });

    // Log activity
    if (task.projectId) {
      await this.activityLogsService.createLog({
        userId: createTaskDto.userId,
        projectId: task.projectId,
        action: 'created',
        entityType: 'task',
        entityId: task.id,
        details: {
          title: task.title,
          status: task.status,
          priority: task.priority,
        },
      });
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId?: string) {
    const oldTask = await this.findOne(id); // Check if exists

    // Vérifier les permissions : propriétaire de la tâche OU admin/owner du projet
    if (userId && oldTask.userId !== userId) {
      // Si l'utilisateur n'est pas le créateur, vérifier s'il est admin/owner du projet
      if (oldTask.projectId) {
        const isOwner = await this.projectMembersService.isProjectOwner(oldTask.projectId, userId);
        const isAdmin = await this.projectMembersService.checkMemberRole(
          oldTask.projectId,
          userId,
          [ProjectRole.ADMIN],
        );
        
        if (!isOwner && !isAdmin) {
          throw new ForbiddenException('You do not have permission to update this task');
        }
      } else {
        throw new ForbiddenException('You do not have permission to update this task');
      }
    }

    const task = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: true,
      },
    });

    // Log activity
    if (task.projectId && userId) {
      await this.activityLogsService.createLog({
        userId,
        projectId: task.projectId,
        action: 'updated',
        entityType: 'task',
        entityId: task.id,
        details: {
          title: task.title,
          changes: updateTaskDto,
        },
      });
    }

    return task;
  }

  async remove(id: string, userId?: string) {
    const task = await this.findOne(id); // Check if exists

    // Vérifier les permissions : propriétaire de la tâche OU admin/owner du projet
    if (userId && task.userId !== userId) {
      // Si l'utilisateur n'est pas le créateur, vérifier s'il est admin/owner du projet
      if (task.projectId) {
        const isOwner = await this.projectMembersService.isProjectOwner(task.projectId, userId);
        const isAdmin = await this.projectMembersService.checkMemberRole(
          task.projectId,
          userId,
          [ProjectRole.ADMIN],
        );
        
        if (!isOwner && !isAdmin) {
          throw new ForbiddenException('You do not have permission to delete this task');
        }
      } else {
        throw new ForbiddenException('You do not have permission to delete this task');
      }
    }

    // Log activity before deletion
    if (task.projectId && userId) {
      await this.activityLogsService.createLog({
        userId,
        projectId: task.projectId,
        action: 'deleted',
        entityType: 'task',
        entityId: task.id,
        details: {
          title: task.title,
        },
      });
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async uploadAttachment(taskId: string, file: Express.Multer.File, userId: string) {
    // Verify task exists
    const task = await this.findOne(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Upload to Cloudinary
    const { url, publicId } = await this.uploadService.uploadFile(file);

    // Save to database
    const attachment = await this.prisma.taskAttachment.create({
      data: {
        taskId,
        fileName: file.originalname,
        fileUrl: url,
        fileType: file.mimetype,
        fileSize: file.size,
        cloudinaryId: publicId,
        uploadedBy: userId,
      },
    });

    // Log activity
    if (task.projectId) {
      await this.activityLogsService.createLog({
        userId,
        projectId: task.projectId,
        action: 'uploaded',
        entityType: 'attachment',
        entityId: attachment.id,
        details: {
          taskTitle: task.title,
          fileName: file.originalname,
        },
      });
    }

    return attachment;
  }

  async getAttachments(taskId: string) {
    return this.prisma.taskAttachment.findMany({
      where: { taskId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteAttachment(taskId: string, attachmentId: string, userId: string) {
    const attachment = await this.prisma.taskAttachment.findUnique({
      where: { id: attachmentId },
      include: {
        task: true,
      },
    });

    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    if (attachment.taskId !== taskId) {
      throw new ForbiddenException('Attachment does not belong to this task');
    }

    // Delete from Cloudinary
    if (attachment.cloudinaryId) {
      await this.uploadService.deleteFile(attachment.cloudinaryId);
    }

    // Delete from database
    await this.prisma.taskAttachment.delete({
      where: { id: attachmentId },
    });

    // Log activity
    if (attachment.task.projectId) {
      await this.activityLogsService.createLog({
        userId,
        projectId: attachment.task.projectId,
        action: 'deleted',
        entityType: 'attachment',
        entityId: attachmentId,
        details: {
          taskTitle: attachment.task.title,
          fileName: attachment.fileName,
        },
      });
    }

    return { message: 'Attachment deleted successfully' };
  }
}
