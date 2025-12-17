import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// made-from-me
import { User } from '../entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// 환경 변수 모듈
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignOptions } from 'jsonwebtoken';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/d0d11f2a-37bf-4c1b-8762-ce966226aadc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'auth.module.ts:7', message: 'AuthModule decorator executing', data: { importsCount: 0, hasUserModule: false }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
// #endregion

@Module({
	imports: [
		TypeOrmModule.forFeature([User]), //User Entity를 이 모듈에서 사용할 수 있게 등록
		PassportModule.register({ defaultStrategy: 'jwt' }), //Passport 라이브러리를 사용하겠다고 등록
		JwtModule.registerAsync({
			imports: [ConfigModule], // ConfigModule을 가져와서 환경 변수 읽기
			inject: [ConfigService],
			useFactory: (configService: ConfigService): JwtModuleOptions => ({
				// secret: JWT 토큰을 서명할 비밀 키
				// .env 파일의 JWT_SECRET 값을 읽어옴
				// 없으면 'your-secret-key' 사용 (개발용, 실제로는 반드시 설정!)
				secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',

				// signOptions: 토큰 생성 시 옵션
				signOptions: {
					// expiresIn: 토큰 만료 시간
					// 예: '1h' (1시간), '30m' (30분), '1y' (1년), '7d' - 7일
					expiresIn: (configService.get<string>('JWT_EXPIRES_IN') || '7d') as SignOptions['expiresIn'],
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy], //JwtStrat-을 providers로 등록해야 @UserGuards()사용가능
	exports: [AuthService,
		JwtModule,
		PassportModule,
	], // 다른 모듈에서 AuthService를 사용할 수 있도록 export
})
export class AuthModule { }