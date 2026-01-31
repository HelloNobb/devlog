// src/project/project.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Project } from './entities/project.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    create(@Body() createProjectDto: CreateProjectDto, @Request() req): Promise<Project> {
        return this.projectService.createProject(createProjectDto, req.user);
    }

    @Get()
    findAll(@Query() queryDto: QueryProjectDto, @Request() req): Promise<{ items: Project[]; meta: any }> {
        return this.projectService.findAllProjects(queryDto, req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Project> {
        return this.projectService.findOneProject(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
        return this.projectService.updateProject(+id, updateProjectDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.projectService.deleteProject(+id);
    }
}
