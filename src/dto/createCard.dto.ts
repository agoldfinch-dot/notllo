import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Length, max } from "class-validator";


export class CreateCardDto {

    @IsString({message: "Must be a string"})
    @ApiProperty({required: true})
    name: string;

    @IsString({message: "Must be a string"})
    @Length(1, 1024, {message: "Length must be between 1 and 1024"})
    @ApiProperty({required: true})
    description: string;

    @IsInt()
    @ApiProperty({required: true})
    columnId: number;
}