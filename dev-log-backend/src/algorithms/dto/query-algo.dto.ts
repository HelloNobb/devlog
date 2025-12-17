// 목적: 검색/필터링/페이지네이션 파라미터 정의
import { IsOptional, IsEnum, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer'; // 쿼리 인자를 숫자로 변환

export class QueryAlgoDto {
    // ========== 검색/필터링 파라미터 ==========
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsEnum(['Easy', 'Medium', 'Hard'])
    difficulty?: string;

    @IsOptional()
    @IsString()
    tag?: string;

    @IsOptional()
    @IsString()
    platform?: string;

    // ========== 페이지네이션 파라미터 ==========
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1; //현재 페이지 번호 (기본값: 1)

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10; //페이지당 항목 수 (기본값: 10)
}

// 💡 응답 예시
// ============================================
/*
{
  "items": [
    {
      "id": 1,
      "title": "두 수의 합",
      "difficulty": "Easy",
      ...
    },
    {
      "id": 2,
      "title": "가장 긴 증가하는 부분 수열",
      "difficulty": "Medium",
      ...
    },
    // ... 20개 (limit=20인 경우)
  ],
  "meta": {
    "total": 47,        // 전체 개수
    "page": 1,          // 현재 페이지
    "limit": 20,        // 페이지당 개수
    "totalPages": 3     // 전체 페이지 수 (47/20 = 2.35 → 3페이지)
  }
}
*/