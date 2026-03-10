import { IsEnum, IsOptional } from 'class-validator';
import { ProjectRole } from './invite-member.dto';

export class UpdateMemberDto {
  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;
}
