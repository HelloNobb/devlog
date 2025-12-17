//목적: 알고리즘 생성 시 받을 데이터 형식 정의
import {
    IsString,      // 문자열인지 확인
    IsEnum,        // 정해진 값 중 하나인지 확인
    IsArray,       // 배열인지 확인
    IsOptional,    // 필수가 아님 (없어도 됨)
    IsNumber,      // 숫자인지 확인
    IsDateString,  // 날짜 문자열 형식인지 확인
    MaxLength,     // 최대 길이 제한
    IsUrl,         // URL 형식인지 확인
} from 'class-validator';

export class CreateAlgoDto {
    @IsString()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    platform?: string;

    @IsEnum(['Easy', 'Medium', 'Hard'])
    difficulty: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @IsString()
    @IsOptional()
    @MaxLength(500)
    problemUrl?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    approach?: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    memo?: string;

    @IsNumber()
    @IsOptional()
    timeSpent?: number;

    @IsDateString()
    @IsOptional()
    solvedAt?: string;
}