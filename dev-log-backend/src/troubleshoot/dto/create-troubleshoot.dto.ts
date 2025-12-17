// src/troubleshoot/dto/create-troubleshoot.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTroubleshootDto {
    @IsString()
    @IsNotEmpty({ message: '문제 상황은 필수입니다' })
    problem: string;

    @IsString()
    @IsOptional()
    moment?: string;

    @IsString()
    @IsNotEmpty({ message: '해결 방법은 필수입니다' })
    solution: string;

    @IsString()
    @IsOptional()
    insight?: string;
}
