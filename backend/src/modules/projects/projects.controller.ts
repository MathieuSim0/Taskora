import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Request() req) {
    return this.projectsService.findAll(req.user.id);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.projectsService.getProjectStats(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.id);
  }

  @Get(':id/stats')
  async getProjectStats(@Param('id') id: string, @Request() req) {
    return this.projectsService.getProjectStatsById(id, req.user.id);
  }

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id);
  }
}
