import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCsLogDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    topic?: string;

    // 페이지네이션
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10;
}
