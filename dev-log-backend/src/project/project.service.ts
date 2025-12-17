// src/project/project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    // CREATE - 새 프로젝트 기록 생성
    async createProject(createProjectDto: CreateProjectDto, user: any): Promise<Project> {
        const project = this.projectRepository.create({
            ...createProjectDto,
            userId: user.sub,
        });
        return this.projectRepository.save(project);
    }

    // READ - 전체 조회 (페이징)
    async findAllProjects(queryDto: QueryProjectDto): Promise<{
        items: Project[];
        meta: { total: number; page: number; limit: number; totalPages: number };
    }> {
        const { page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;

        const [items, total] = await this.projectRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // READ - 단일 조회
    async findOneProject(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id } });
        if (!project) {
            throw new NotFoundException(`Project #${id} not found`);
        }
        return project;
    }

    // UPDATE - 수정
    async updateProject(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
        await this.findOneProject(id);
        await this.projectRepository.update(id, updateProjectDto);
        return this.findOneProject(id);
    }

    // DELETE - 삭제
    async deleteProject(id: number): Promise<void> {
        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project #${id} not found`);
        }
    }
}
