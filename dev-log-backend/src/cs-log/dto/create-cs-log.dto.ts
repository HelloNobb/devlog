import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCsLogDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    category: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    topic: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
