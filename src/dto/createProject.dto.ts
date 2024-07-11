import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({required: true})
    @IsString({message: "Must be a string"})
    readonly name: string;

    @ApiProperty({required: true})
    @IsString({message: "Must be a string"})
    readonly description: string;

}