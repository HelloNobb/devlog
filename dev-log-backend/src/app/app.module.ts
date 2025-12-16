import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { User } from '../entities/user.entity';

fetch('http://127.0.0.1:7242/ingest/d0d11f2a-37bf-4c1b-8762-ce966226aadc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app.module.ts:8',message:'AppModule decorator executing',data:{hasTypeOrmRoot:false,importsCount:1},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
// #endregion

@Module({
  imports: [
	TypeOrmModule.forRoot({
		type: 'mysql',
		host: process.env.DB_HOST || 'localhost', // 환경변수에서 DB_HOST 값 읽고 없으면 기본값 localhost 씀
		port: parseInt(process.env.DB_PORT || '3306'), // 3306: mariaDB 기본 포트
		username: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_DATABASE || 'dev_log',
		entities: [User], // User클래스가 DB의 users 테이블과 매핑됨
		synchronize: process.env.NODE_ENV !== 'production', // 자동 스키마 동기화 여부 > 개발 환경에서만 자동 동기화
	}),
	AuthModule,
	UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
