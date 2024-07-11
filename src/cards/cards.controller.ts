import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateCardDto } from 'src/dto/createCard.dto';
import { CardsService } from './cards.service';
import { User } from 'src/user/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('cards')
@ApiTags("Cards")
export class CardsController {

    constructor(private readonly cardsService: CardsService) {
        
    }

    @Post('')
    @UseGuards(JwtAuthGuard)
    async createCard(@User('id') userId, @Body() createCard: CreateCardDto)
    {
        return this.cardsService.createCard(userId, createCard)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/position/:id/:position')
    changePosition(@User('id') userId, @Param('id', ParseIntPipe) cardId, @Param('position', ParseIntPipe) position)
    {
        return this.cardsService.changePosition(userId, cardId, position)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/position/:id/:position/:columnId')
    changeColumn(@User('id') userId, @Param('id', ParseIntPipe) cardId, @Param('position', ParseIntPipe) position, @Param("columnId", ParseIntPipe) columnId)
    {
        return this.cardsService.changeColumn(userId, cardId, position, columnId)
    }
}
