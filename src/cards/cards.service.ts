import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CardsService {
    constructor (private readonly prismaService: PrismaService) {}

    private async checkAccess(userId, cardId) {
        const projectId = await this.prismaService.columns.findFirst({include: {cards: true}, where: {cards: {some: {id:cardId}}}})

        if (projectId === null) {
            throw new HttpException("No such card, column or project", HttpStatus.NOT_FOUND)
        }

        const authorId = await this.prismaService.projects.findFirst({select: {authorId: true}, where: {id: projectId.projectId}})

        if (authorId?.authorId != userId) 
        {
            return false;
        }
        
        return true
    }

    async createCard(userId, card) {
        const {name, description, columnId} = card;
        const project = await this.prismaService.projects.findFirst({
            where: {
                columns:{
                    some: {
                        id: columnId
                    }
                }
            },
            include: {columns: true}
        });

        if (!project) {
            throw new HttpException("No such column or project", HttpStatus.BAD_REQUEST);
        }

        if (project.authorId != userId)
        {
            throw new HttpException("It's not your project!!!", HttpStatus.FORBIDDEN);
        }
        
        const position = await this.prismaService.cards.count({where: {columnId: columnId}}) + 1;
        
        return this.prismaService.cards.create({
            data: {
                name,
                description,
                position: position,
                columns: {
                    connect: {id: columnId}
                }
            }
        })
    }


    async swapCards(userId, firstCardId, secondCardId) {
        const firsCard = await this.prismaService.cards.findFirst({where:{id:firstCardId}})
        const secondCard = await this.prismaService.cards.findFirst({where:{id:secondCardId}})

        if (!firsCard && !secondCard)
        {
            throw new HttpException("No such columns", HttpStatus.NOT_FOUND)
        }

        if (!await this.checkAccess(userId, firstCardId) || !await this.checkAccess(userId, secondCardId))
        {
            throw new HttpException("You have no access to this columns", HttpStatus.FORBIDDEN)
        }

        const updatedFirst = await this.prismaService.cards.update({
            data: {
                position: secondCard.position
            },
            where:{id:firstCardId}})

        const updatedSecond = await this.prismaService.cards.update({
            data: {
                position: firsCard.position
            },
            where: {id: secondCardId}
        })

        return [updatedFirst, updatedSecond]
    }

    async changeColumn(userId, cardId, position, columnId) {
        
        const column = await this.prismaService.columns.findFirst({select: {projectId: true}, where:{id:columnId}})
        if (column === null) {
            throw new HttpException("No such card, column or project", HttpStatus.NOT_FOUND)
        }

        const authorId = await this.prismaService.projects.findFirst({select: {authorId: true}, where: {id: column.projectId}})
        if (authorId.authorId != userId)
        {
            console.log(authorId, userId)
            throw new HttpException("You have no access to this card", HttpStatus.FORBIDDEN)
        }

        
        const card = await this.prismaService.cards.findFirst({where:{id:cardId}})
        
        if (card.columnId == columnId) {
            throw new HttpException("card already in column", HttpStatus.BAD_REQUEST)
        }
        await this.prismaService.cards.updateMany({
            data: { position: {decrement: 1}},
            where: {
                AND: [
                    {columnId: card.columnId},
                    {position: {gt: card.position-1}}
                ]
            }
        })
        const _position = await this.prismaService.cards.count({where:{columnId:columnId}}) + 1
        await this.prismaService.cards.update({data:{columnId:columnId, position: _position}, where:{id:cardId}})
        if (_position == position) {
            return this.prismaService.columns.findMany({where:{id:columnId}})
        }
        return this.changePosition(userId, cardId, position)
    } 

    async changePosition(userId, cardId, position) {
        if (position < 1) 
        {
            throw new HttpException("Position can't be less than 1", HttpStatus.BAD_REQUEST)
        }

        if (!await this.checkAccess(userId, cardId)) {
            throw new HttpException("You have no access to this card", HttpStatus.FORBIDDEN)
        }

        const card = await this.prismaService.cards.findFirst({where:{id:cardId}})
        
        if (position == card.position) {
            throw new HttpException("Card already in position", HttpStatus.BAD_REQUEST)
        }

        
        const len = await this.prismaService.cards.findMany({
            where: { columnId: card.columnId}, orderBy: {position: "asc"}
        })

        if (len.length+1 < position)
        {
            throw new HttpException(`Position not in range`, HttpStatus.BAD_REQUEST)
        }

        if (Math.abs(position - card.position) == 1)
        {
            await this.swapCards(userId, cardId, len[position-1].id)
        }
        else {
            await this.prismaService.cards.updateMany({
                data: {
                    position: {increment: 1}
                },
                where: {
                    AND: [
                        {columnId: card.columnId},
                        {position: {gt: position-1}}
                    ]
                }
            })

            await this.prismaService.cards.update({data: {position: position}, where: {id: cardId}})

            await this.prismaService.cards.updateMany({
                data: { position: {decrement: 1}},
                where: {
                    AND: [
                        {columnId: card.columnId},
                        {position: {gt: card.position}}
                    ]
                }
            })
        }

        return this.prismaService.cards.findMany({where:{columnId:card.columnId}, orderBy: {position: "asc"}})
    } 

    async deleteCard(userId, cardId) {

        if (!await this.checkAccess(userId, cardId)) {
            throw new HttpException("You have no access to this card", HttpStatus.FORBIDDEN)
        }
        
        const card = await this.prismaService.cards.delete({where:{id:cardId}})

        await this.prismaService.cards.updateMany({
            data: { position: {decrement: 1}},
            where: {
                AND: [
                    {columnId: card.columnId},
                    {position: {gt: card.position-1}}
                ]
            }
        })

        return card
    }

}
