import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { throws } from 'assert';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColumnsService {
    

    constructor(private readonly prismaService: PrismaService) {}


    private async checkAccess(userId, columnId) {
        const projectId = await this.prismaService.columns.findFirst({select: {projectId: true}, where: {id: columnId}})

        if (projectId === null) {
            throw new HttpException("No such column or project", HttpStatus.NOT_FOUND)
        }

        const authorId = await this.prismaService.projects.findFirst({select: {authorId: true}, where: {id: projectId.projectId}})

        if (authorId?.authorId != userId) 
        {
            return false;
        }
        
        return true
    }

    async swapColumns(userId, firstColumnId, secondColumnId) {
        const firsColumn = await this.prismaService.columns.findFirst({where:{id:firstColumnId}})
        const secondColumn = await this.prismaService.columns.findFirst({where:{id:secondColumnId}})

        if (!firsColumn && !secondColumn)
        {
            throw new HttpException("No such columns", HttpStatus.NOT_FOUND)
        }

        if (!await this.checkAccess(userId, firstColumnId) || !await this.checkAccess(userId, secondColumnId))
        {
            throw new HttpException("You have no access to this columns", HttpStatus.FORBIDDEN)
        }

        const updatedFirst = await this.prismaService.columns.update({
            data: {
                position: secondColumn.position
            },
            where:{id:firstColumnId}})

        const updatedSecond = await this.prismaService.columns.update({
            data: {
                position: firsColumn.position
            },
            where: {id: secondColumnId}
        })

        return [updatedFirst, updatedSecond]
    }

    async changePosition(userId, columnId, position)
    {
        if (position < 1) 
        {
            throw new HttpException("Position can't be less than 1", HttpStatus.BAD_REQUEST)
        }
        if (!await this.checkAccess(userId, columnId)) {
            throw new HttpException("You have no access to this column", HttpStatus.FORBIDDEN)
        }

        const column = await this.prismaService.columns.findFirst({where:{id:columnId}})
        
        if (position == column.position) {
            throw new HttpException("Column already in position", HttpStatus.BAD_REQUEST)
        }

        
        const len = await this.prismaService.columns.findMany({
            where: { projectId: column.projectId}, orderBy: {position: "asc"}
        })

        if (len.length+1 < position)
        {
            throw new HttpException(`Position not in range`, HttpStatus.BAD_REQUEST)
        }

        if (Math.abs(position - column.position) == 1)
        {
            await this.swapColumns(userId, columnId, len[position-1].id)
        }
        else {
            await this.prismaService.columns.updateMany({
                data: {
                    position: {increment: 1}
                },
                where: {
                    AND: [
                        {projectId: column.projectId},
                        {position: {gt: position-1}}
                    ]
                }
            })

            await this.prismaService.columns.update({data: {position: position}, where: {id: columnId}})

            await this.prismaService.columns.updateMany({
                data: { position: {decrement: 1}},
                where: {
                    AND: [
                        {projectId: column.projectId},
                        {position: {gt: column.position}}
                    ]
                }
            })
        }
        
       
        return this.prismaService.columns.findMany({where:{projectId:column.projectId}, orderBy: {position: "asc"}})

    }
    
    async changeInfo(userId, columnId, name)
    {
        if (!await this.checkAccess(userId, columnId)) {
            throw new HttpException("You have no access to this column", HttpStatus.FORBIDDEN)
        }

        return this.prismaService.columns.update({data: {name}, where: {id: columnId}})
    }

    async deleteColumn(userId, columnId) {

        if (!await this.checkAccess(userId, columnId)) {
            throw new HttpException("You have no access to this column", HttpStatus.FORBIDDEN)
        }
        
        const column = await this.prismaService.columns.delete({where:{id:columnId}})

        await this.prismaService.columns.updateMany({
            data: { position: {decrement: 1}},
            where: {
                AND: [
                    {projectId: column.projectId},
                    {position: {gt: column.position-1}}
                ]
            }
        })

        return column
    }

    async createColumn(userId, column) {
        const {name, projectId} = column 
        const position = await this.prismaService.columns.count({where: {projectId: projectId}}) + 1
        const project = await this.prismaService.projects.findFirst({where:{id:projectId}})
        
        if (!project) {
            throw new HttpException('No such project', HttpStatus.NOT_FOUND)
        }

        if (project.authorId != userId) {
            throw new HttpException("It's not your project", HttpStatus.FORBIDDEN)
        }

        return this.prismaService.columns.create(
            {
            
                data: {
                    name: name,
                    position: position,
                    project: {
                        connect: {id: projectId}
                }
                },
                
            }
        )
    }
    
}
