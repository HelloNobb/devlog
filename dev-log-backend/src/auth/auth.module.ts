import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/d0d11f2a-37bf-4c1b-8762-ce966226aadc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.module.ts:7',message:'AuthModule decorator executing',data:{importsCount:0,hasUserModule:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}