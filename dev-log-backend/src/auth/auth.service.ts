import { Injectable,	// service 클래스임 표시
		ConflictException,	// err:409 (이미 존재하는 데이터)
		UnauthorizedException	// err:401 (인증 실패)
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
//signup
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		private readonly userService : UserService, //UserService 주입
		private readonly jwtService : JwtService, //JWT 토큰 생성/검증 서비스 주입
	){}

	/* 회원가입 */
	async signup(signupDto: SignupDto){
		const { email, pwd, name } = signupDto;

		// 1:이메일 중복 확인
		const existingUser = await this.userRepository.findOne({
			where: { email }
		});
		// - 중복이면,
		if (existingUser){
			// 이미 존재하는 이메일입니다.
			throw new ConflictException('이미 존재하는 이메일입니다');
		}
		
		// 2: 비번 암호화
		const salt = await bcrypt.genSalt(10);
		const hashedPwd = await bcrypt.hash(pwd, salt);
	
		// 3: 새 사용자 객체 생성
		const user = this.userRepository.create({
			email, 
			pwd:hashedPwd, 
			name,
		});

		// 4: DB에 실제로 저장
		await this.userRepository.save(user);

		// 5: JWT 토큰 생성
		/* 토큰에 담을 정보 */
		const payload = {
			sub: user.id,
			email: user.email
		};
		/* 토큰 생성 */
		const accessToken = this.jwtService.sign(payload);

		// 6: 응답 반환 (pwd 제외)
		const { pwd: _, ...userWithoutPwd } = user;

		return {
			user: userWithoutPwd,
			accessToken,
		};
	}

	/* 로그인 */
	async login(loginDto: LoginDto){
		const { email, pwd } = loginDto;

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
			accessToken: this.jwtService.sign(payload), // payLoad를 JWT 토큰으로 암호화
			// 생성된 토큰 형식: "header.payload.signature" / > 이 토큰 받아서 클라는 쿠키에 저장해야함
		};
	}

	async getProfile(userId: number){
		// userId로 사용자 찾기
		const user = await this.userRepository.findOne({
			where: { id: userId }
		});

		if (!user){
			throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
		}

		// 비밀번호 제외하고 반환
		const { pwd, ...userWithoutPwd } = user;

		return userWithoutPwd;
	}
}
