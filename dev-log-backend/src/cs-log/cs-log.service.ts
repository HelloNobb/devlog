import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CsLog } from './entities/cs-log.entity';
import { CreateCsLogDto } from './dto/create-cs-log.dto';
import { UpdateCsLogDto } from './dto/update-cs-log.dto';
import { QueryCsLogDto } from './dto/query-cs-log.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CsLogService {
    constructor(
        @InjectRepository(CsLog)
        private csLogRepository: Repository<CsLog>,
    ) { }

    // 1: CREATE
    async createCsLog(createCsLogDto: CreateCsLogDto, user: any): Promise<CsLog> {
        const newLog = this.csLogRepository.create({
            ...createCsLogDto,
            userId: user.sub, // JWT payload의 sub 필드 (사용자 ID)
        });
        return this.csLogRepository.save(newLog);
    }

    // 2: READ (Pagination)
    async findAllCsLogs(queryDto: QueryCsLogDto, userId: number): Promise<{ items: CsLog[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
        const { page = 1, limit = 10, category, topic } = queryDto;
        const queryBuilder = this.csLogRepository.createQueryBuilder('cs_log');

        // 사용자 필터링 (필수)
        queryBuilder.where('cs_log.userId = :userId', { userId });

        // 필터링
        if (category) {
            queryBuilder.andWhere('cs_log.category = :category', { category });
        }
        if (topic) {
            queryBuilder.andWhere('cs_log.topic ILIKE :topic', { topic: `%${topic}%` });
        }

        // 페이지네이션
        const [items, total] = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('cs_log.createdAt', 'DESC')
            .getManyAndCount();

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

    // 단일 상세 조회
    async findOneCsLog(id: number): Promise<CsLog> {
        const log = await this.csLogRepository.findOne({ where: { id } });
        if (!log) {
            throw new NotFoundException(`CsLog with ID ${id} not found`);
        }
        return log;
    }

    // 3: UPDATE
    async updateCsLog(id: number, updateCsLogDto: UpdateCsLogDto): Promise<CsLog> {
        const log = await this.findOneCsLog(id);
        Object.assign(log, updateCsLogDto);
        return this.csLogRepository.save(log);
    }

    // 4: DELETE
    async deleteCsLog(id: number): Promise<void> {
        const result = await this.csLogRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`CsLog with ID ${id} not found`);
        }
    }
}
