// src/memo/memo.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MemoService } from './memo.service';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('memos')
@UseGuards(JwtAuthGuard)
export class MemoController {
    constructor(private readonly memoService: MemoService) { }

    // 메모 생성
    @Post()
    create(@Body() dto: CreateMemoDto, @Request() req) {
        return this.memoService.create(dto, req.user.sub);  // sub = userId
    }

    // 메모 목록 (페이징)
    @Get()
    findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
        return this.memoService.findAll(+page, +limit);
    }

    // 메모 상세
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.memoService.findOne(+id);
    }

    // 메모 수정
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateMemoDto, @Request() req) {
        return this.memoService.update(+id, dto, req.user.sub);
    }

    // 메모 삭제
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req) {
        return this.memoService.remove(+id, req.user.sub);
    }

    // 댓글 추가
    @Post('comments')
    addComment(@Body() dto: CreateCommentDto, @Request() req) {
        return this.memoService.addComment(dto, req.user.sub);
    }

    // 댓글 삭제
    @Delete('comments/:id')
    removeComment(@Param('id') id: string, @Request() req) {
        return this.memoService.removeComment(+id, req.user.sub);
    }
}

