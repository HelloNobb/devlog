import { Controller, Get, Post, Body, ValidationPipe, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthGuard } from "@nestjs/passport";
//import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController{
	//주입식 생성자
	constructor(private authService: AuthService){}

	@Post('login') // 'POST /auth/login' 요청 시 이 함수 실행
	async login(@Body() loginDto : LoginDto){ //@Body() : Http요청의 body data를 이 파라미터에 주입하라(req.body)
		// : dto에서 이미 입력값 검증받고 옴
		return this.authService.login(loginDto);
	}
	// Guard: 라우트 접근 제어 - (요청 > 가드 > 컨트롤러 순)
	//@UseGuards(JwtAuthGuard) // 이 데코레이터가 있으면 요청 전에 JWT 검증 실행 (검증 실패 시 401 Unauthorized 에러 자동 반환)====
	@Get('profile')
	getProfile(@Request() req){
		return req.user; //// { userId: 1, email: 'user@example.com' }
	}
}