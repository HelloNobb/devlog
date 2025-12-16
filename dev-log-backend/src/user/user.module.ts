import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/d0d11f2a-37bf-4c1b-8762-ce966226aadc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'user.module.ts:7',message:'UserModule decorator executing',data:{importsCount:0,hasTypeOrm:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}