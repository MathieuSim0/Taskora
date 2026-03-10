import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.taskCommentsService.create(taskId, req.user.id, createCommentDto);
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.taskCommentsService.findAll(taskId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.taskCommentsService.update(id, req.user.id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.taskCommentsService.remove(id, req.user.id);
  }
}
