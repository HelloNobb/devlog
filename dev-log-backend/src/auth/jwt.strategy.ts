import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
	// PassportStrategy(Strategy): passport-jwt의 Strategy를 NestJS에서 사용
	// *Passport: Node.js의 인증 미들웨어 라이브러리
	constructor() {
		super({
		// super(): 부모 클래스(PassportStrategy)의 생성자 호출
		
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		// JWT 토큰을 어디서 추출할지 설정
		// fromAuthHeaderAsBearerToken(): 
		//   HTTP Header의 'Authorization: Bearer <token>' 에서 토큰 추출
		
		ignoreExpiration: false,
		// false: 만료된 토큰은 거부
		// true: 만료된 토큰도 허용 (보안상 비추천)
		
		secretOrKey: 'your-secret-key',
		// JWT 서명 검증에 사용할 비밀키
		// 실제 프로덕션에서는 환경변수로 관리
		// process.env.JWT_SECRET 권장
		});
  	}

	async validate(payload: any) {
    	// JWT 토큰이 유효하면 자동으로 호출되는 메서드
    	// payload: JWT 토큰 안에 담긴 데이터 (디코딩된 상태)
    	// 예: { sub: 1, email: 'user@example.com', iat: 1616239022, exp: 1616242622 }
    
    	// 여기서 추가적인 검증 로직을 넣을 수 있음
    	// 예: DB에서 사용자가 여전히 존재하는지, 탈퇴했는지 등
		return {
		userId: payload.sub,
		// sub에 저장된 사용자 ID
		email: payload.email,
		};
    	// 이 반환값은 req.user에 자동으로 할당됨
    	// 컨트롤러에서 @Request() req 로 접근 가능
  	}

}