import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {

    constructor(private readonly prismaService: PrismaService) {}

    getUserProjects (id) {
        return this.prismaService.projects.findMany({
            where: { authorId:id }, 
            include: {
                columns: {
                    include: {
                        cards: {
                            orderBy: {
                                position: "asc"}}},
            orderBy: {position: "asc"}}}})
    }
    
    createProject (id, project) {
        return this.prismaService.projects.create({
            data: {
                ...project,
                user: {
                    connect: {id: id}
                }
            },
            
        })
    }

    deleteProject (userId, projectId: number) {
        return this.prismaService.projects.deleteMany({
            where: {
                AND: 
                [   
                {id: +projectId},
                {authorId:userId},
                ],
            }
        })
    }
}
