import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private userService : UserService, //UserService 주입
		private jwtService : JwtService, //JWT 토큰 생성/검증 서비스 주입
	){}

	async login(email: string, pwd: string){

		// 1: 유저 정보 존재 확인 ========
		const user = await this.userService.findByEmail(email);

		if (!user){ // ->401:Unauthorized Error 발생
			throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
		}
		// 2: 비밀번호 검증 (hash값 비교) ========
		const isPwdValid = await bcrypt.compare(pwd, user.pwd); // 같은 방식으로 pwd 해싱 후 비교 (user.pwd 안에 든 salt값 추출)
		
		if (!isPwdValid){
			throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
		}

		// 3: JWT 토큰 생성 =========
		const payload = { // 민감한 정보 X
			sub: user.id, // jwt 표준 필드, 토큰 주체 (유저 ID)
			email: user.email,
		}; // -> jwt 토큰에 담을 데이터

		return {
			access_token: this.jwtService.sign(payload), // payLoad를 JWT 토큰으로 암호화
			// 생성된 토큰 형식: "header.payload.signature" / > 이 토큰 받아서 클라는 쿠키에 저장해야함
		};
	}
}
