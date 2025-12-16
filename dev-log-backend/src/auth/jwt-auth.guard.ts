import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){ // Passport전략을 Nest Guard로 연결하는 아답터
	// AuthGuard('jwt'): passport의 'jwt' 전략을 사용하는 가드
	// 'jwt'는 JwtStrategy에서 자동으로 등록된 전략 이름
	
	// 이 가드를 컨트롤러에 적용하면:
	// 1. 요청에서 JWT 토큰 추출
	// 2. 토큰 서명 검증
	// 3. 토큰 만료 확인
	// 4. 모든 검증 통과 시 JwtStrategy.validate() 실행
	// 5. validate()의 반환값을 req.user에 저장
	// 6. 라우트 핸들러 실행
}