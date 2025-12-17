import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AlgoModule } from '../algorithms/algo.module';
import { CsLogModule } from '../cs-log/cs-log.module';
import { User } from '../entities/user.entity';

fetch('http://127.0.0.1:7242/ingest/d0d11f2a-37bf-4c1b-8762-ce966226aadc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'app.module.ts:8', message: 'AppModule decorator executing', data: { hasTypeOrmRoot: false, importsCount: 1 }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
// #endregion

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mysql',
				host: configService.get<string>('DB_HOST', 'localhost'),
				port: configService.get<number>('DB_PORT', 3306),
				username: configService.get<string>('DB_USERNAME', 'root'),
				password: configService.get<string>('DB_PASSWORD', ''),
				database: configService.get<string>('DB_DATABASE', 'dev_log'),
				entities: [User],
				synchronize: configService.get<string>('NODE_ENV') !== 'production',
				autoLoadEntities: true, // Entity 자동 로드 (수동 배열 생략 가능)
			}),
		}),
		AuthModule,
		UserModule,
		AlgoModule, // 추가
		CsLogModule, // 추가
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
