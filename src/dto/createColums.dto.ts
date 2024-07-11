import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class CreateColumnsDto {

    @ApiProperty({required: true})
    @IsString({message: "Must be a string"})
    readonly name: string;

    @ApiProperty({required: true})
    readonly projectId: number;

}