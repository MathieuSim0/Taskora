import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export enum ProjectRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export class InviteMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ProjectRole)
  @IsNotEmpty()
  role: ProjectRole;
}
