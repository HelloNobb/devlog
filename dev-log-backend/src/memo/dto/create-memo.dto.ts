// src/memo/dto/create-memo.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateMemoDto {
    @IsString()
    content: string;

    @IsOptional()
    @IsString()
    color?: string;
}
