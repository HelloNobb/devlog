import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule); //nestJS 애플리케이션 인스턴스 생성

	// CORS 설정 - 프론트엔드에서 오는 요청 허용
	app.enableCors({
		origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // 여러 포트 허용
		credentials: true,               // 쿠키/인증 정보 포함 허용
	});

	app.useGlobalPipes(
		// 전역 Validation-Pipe 설정  - 모든 컨트롤러에서 자동 DTO 검증 실행
		new ValidationPipe({
			whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
			forbidNonWhitelisted: true, // DTO에 없는 속성이 있으면 요청 자체를 거부 (400 에러)
			transform: true, // 요청 데이터를 DTO 클래스 인스턴스로 자동변환 (타입도 자동 변환 "25" > 25)
		}),
	);

	await app.listen(process.env.PORT ?? 3001); //포트3001에서 서버 시작 (프론트 3000과 분리)
}
bootstrap();
