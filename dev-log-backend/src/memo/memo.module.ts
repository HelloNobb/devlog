// src/memo/memo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';
import { Memo, MemoComment } from './entities/memo.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Memo, MemoComment])],
    controllers: [MemoController],
    providers: [MemoService],
})
export class MemoModule { }
