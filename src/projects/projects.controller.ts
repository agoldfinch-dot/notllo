import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.decorator';
import { CreateProjectDto } from 'src/dto/createProject.dto';

@ApiTags("Projects")
@Controller('projects')
export class ProjectsController {

    constructor(private readonly projectsService: ProjectsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    getProjects(@User('id') id) {
        return this.projectsService.getUserProjects(id)
    } 

    @UseGuards(JwtAuthGuard)
    @Post('')
    createProject(@User('id') id, @Body() project: CreateProjectDto) {
        return this.projectsService.createProject(id, project)
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:projectId')
    deleteProject(@User('id') id, @Param('projectId', ParseIntPipe) projectId: number) {
        return this.projectsService.deleteProject(id, projectId)
    }

}
