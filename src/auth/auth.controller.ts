import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("Authorization")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('/login')
    login(@Body() user: CreateUserDto)
    {
        return this.authService.login(user);
    }

    @Post('/registration')
    registration(@Body() user: CreateUserDto)
    {
        return this.authService.registration(user);
    }
}
