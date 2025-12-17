/* 목적: 알고리즘 수정 시 받을 데이터 형식 정의 */

// PartialType: NestJS에서 제공하는 헬퍼 함수
import { PartialType } from '@nestjs/mapped-types';
import { CreateAlgoDto } from './create-algo.dto';

// PartialType(CreateAlgorithmDto)의 의미:
// CreateAlgorithmDto의 모든 필드를 가져오되,
// 모든 필드를 선택적(optional)으로 만듦
// -> 구현 이유: 수정할 때는 모든 필드를 보낼 필요가 없음!

export class UpdateAlgoDto extends PartialType(CreateAlgoDto) { }
