import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    getUserByEmail(email) {
        return this.prismaService.user.findFirst({

            where: {email: email}
        })
    }
    
    async addUser(userData: CreateUserDto)
    {
        const { username, password, email } = userData;
        const user = await this.prismaService.user.create({
            data: {
               username,
               password,
               email,
            }
        });
        return user
        
    }
}
