import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivityLogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: {
    userId: string;
    projectId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: any;
  }) {
    return this.prisma.activityLog.create({
      data: {
        userId: data.userId,
        projectId: data.projectId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details || {},
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getProjectLogs(projectId: string, limit: number = 50) {
    return this.prisma.activityLog.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUserLogs(userId: string, limit: number = 50) {
    return this.prisma.activityLog.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async deleteProjectLogs(projectId: string) {
    return this.prisma.activityLog.deleteMany({
      where: { projectId },
    });
  }
}
