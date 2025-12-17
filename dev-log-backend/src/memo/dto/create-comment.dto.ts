// src/memo/dto/create-comment.dto.ts
import { IsString, IsNumber } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    content: string;

    @IsNumber()
    memoId: number;
}
