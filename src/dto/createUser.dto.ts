import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length} from "class-validator";


export class CreateUserDto 
{

    @ApiProperty({required: true})
    @IsString({message: "Must be a string"})
    @IsEmail({}, {message:"NOT EMAIL BRO"})
    readonly email: string;

    @ApiProperty({required: true})
    @IsString({message: "Must be a string"})
    @Length(4, 16, {message:"Length must be between 4 and 16"})
    readonly password: string;

    @ApiProperty({required: true})
    @IsString({message: "Must be a string"})
    readonly username: string;
}