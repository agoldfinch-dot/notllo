import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateColumnsDto } from 'src/dto/createColums.dto';
import { ColumnsService } from './columns.service';
import { User } from 'src/user/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('columns')
@ApiTags("Columns")
export class ColumnsController {

    constructor(private readonly columnsService: ColumnsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('')
    createColumn(@User('id') userId, @Body() column: CreateColumnsDto)
    {
        return this.columnsService.createColumn(userId, column);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    deleteColumn(@User('id') userId, @Param('id', ParseIntPipe) columnId) 
    {
        return this.columnsService.deleteColumn(userId, columnId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/swap/:firstColumnId/:secondColumnId')
    swapColumns(@User('id') userId, @Param('firstColumnId', ParseIntPipe) firstColumnId, @Param('SecondColumnId', ParseIntPipe) secondColumnId)
    {
        return this.columnsService.swapColumns(userId, firstColumnId, secondColumnId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/position/:id/:position')
    changePosition(@User('id') userId, @Param('id', ParseIntPipe) columnId, @Param('position', ParseIntPipe) position)
    {
        return this.columnsService.changePosition(userId, columnId, position)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:id/:name')
    changeInfo(@User('id') userId, @Param('id', ParseIntPipe) firstColumnId, @Param('name') name)
    {
        return this.columnsService.changeInfo(userId, firstColumnId, name)
    }

}
