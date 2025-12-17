import { PartialType } from '@nestjs/mapped-types';
import { CreateCsLogDto } from './create-cs-log.dto';

export class UpdateCsLogDto extends PartialType(CreateCsLogDto) { }
// CreateCsLogDto: 검증 (categ, topic, content가 string이고 비지 않았는지)
// UpdateCsLogDto: create-확장, 근데 모든 필드 선택사항으로 변경 + 각 요소 부분패치 가능하게