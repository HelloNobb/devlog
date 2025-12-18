// src/memo/memo.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Memo, MemoComment } from './entities/memo.entity';
import { CreateMemoDto } from './dto/create-memo.dto';
import { UpdateMemoDto } from './dto/update-memo.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class MemoService {
    constructor(
        @InjectRepository(Memo)
        private memoRepo: Repository<Memo>,
        @InjectRepository(MemoComment)
        private commentRepo: Repository<MemoComment>,
    ) { }

    // 메모 생성
    async create(dto: CreateMemoDto, userId: number): Promise<Memo> {
        const memo = this.memoRepo.create({
            ...dto,
            userId,
        });
        return this.memoRepo.save(memo);
    }

    // 메모 목록 (페이징, 최신순)
    async findAll(page: number = 1, limit: number = 10, userId: number) {
        const [items, total] = await this.memoRepo.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
            relations: ['comments', 'comments.user', 'user'],
        });

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // 메모 상세
    async findOne(id: number): Promise<Memo> {
        const memo = await this.memoRepo.findOne({
            where: { id },
            relations: ['comments', 'comments.user', 'user'],
        });
        if (!memo) throw new NotFoundException('메모를 찾을 수 없습니다.');
        return memo;
    }

    // 메모 수정
    async update(id: number, dto: UpdateMemoDto, userId: number): Promise<Memo> {
        const memo = await this.findOne(id);
        if (memo.userId !== userId) {
            throw new ForbiddenException('본인만 수정할 수 있습니다.');
        }
        Object.assign(memo, dto);
        return this.memoRepo.save(memo);
    }

    // 메모 삭제
    async remove(id: number, userId: number): Promise<void> {
        const memo = await this.findOne(id);
        if (memo.userId !== userId) {
            throw new ForbiddenException('본인만 삭제할 수 있습니다.');
        }
        await this.memoRepo.remove(memo);
    }

    // 댓글 추가
    async addComment(dto: CreateCommentDto, userId: number): Promise<MemoComment> {
        await this.findOne(dto.memoId); // 메모 존재 확인
        const comment = this.commentRepo.create({
            content: dto.content,
            memoId: dto.memoId,
            userId,
        });
        return this.commentRepo.save(comment);
    }

    // 댓글 삭제
    async removeComment(commentId: number, userId: number): Promise<void> {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');
        if (comment.userId !== userId) {
            throw new ForbiddenException('본인만 삭제할 수 있습니다.');
        }
        await this.commentRepo.remove(comment);
    }
}
