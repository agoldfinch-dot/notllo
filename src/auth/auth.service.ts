import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import * as bcrypt from "bcryptjs"
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) {}

    async registration(user) {
        const candidate = await this.userService.getUserByEmail(user.email);
        if (candidate)
        {
            throw new HttpException("Пользователь с таким email уже существует", HttpStatus.BAD_REQUEST);
        } 
        const hashPassword = await bcrypt.hash(user.password, 5)
        const _user = await this.userService.addUser({...user, password: hashPassword})
        return this.generateToken(_user);
    }

    async login(user) {
        const _user = await this.validateUser(user);
        return this.generateToken(_user)    
    } 

    private async generateToken(user) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    
    private async validateUser(user: CreateUserDto)
    {
        const _user = await this.userService.getUserByEmail(user.email);
        if (!_user)
        {
            throw new UnauthorizedException({"message": "Неверный email"})
        }
        const isPasswordsEqual = await bcrypt.compare(user.password, _user.password);
        if (_user && isPasswordsEqual)
        {
            return _user   
        }
        else
        {
            throw new UnauthorizedException({"message": "Некорректный пароль"})
        }
    }

}
