import { Controller, Get, Post, Body, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/auth.dto";
//import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController{
	//주입식 생성자
	constructor(private authService: AuthService){}

	@Post('login') // 'POST /auth/login' 요청 시 이 함수 실행
	async login(@Body() loginDto : LoginDto){ //@Body() : Http요청의 body data를 이 파라미터에 주입하라(req.body)
		// : dto에서 이미 입력값 검증받고 옴
		return this.authService.login(loginDto.email, loginDto.pwd);
	}
}