import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		//private userService : UserService, //UserService 주입
		//private jwtService : JwsService, //JWT 토큰 생성/검증 서비스 주입
	){}

	login(email: string, pwd: string){
		
		/* 로그인 처리 */
		return '로그인 처리 완료';
	}
}
