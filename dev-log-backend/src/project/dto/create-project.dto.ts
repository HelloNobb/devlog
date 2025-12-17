// src/project/dto/create-project.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty({ message: '프로젝트명은 필수입니다' })
    projectName: string;

    @IsString()
    @IsNotEmpty({ message: '구현 내용은 필수입니다' })
    implementation: string;

    @IsString()
    @IsOptional()
    memo?: string;
}
