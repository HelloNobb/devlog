// 기능: 알고리즘 CRUD

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
// TypeORM Repository 관련
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity, DTO import
import { Algorithm } from './entities/algo.entity';
import { CreateAlgoDto } from './dto/create-algo.dto';
import { UpdateAlgoDto } from './dto/update-algo.dto';
import { QueryAlgoDto } from './dto/query-algo.dto';

// @Injectable(): 이 서비스를 다른 곳에서 사용 가능하게 만듦
@Injectable()
export class AlgoService {
    // 0: Repository 주입 ==========
    constructor(
        @InjectRepository(Algorithm)
        private algoRepository: Repository<Algorithm>,
    ) { }

    // 1: CREATE - 알고리즘 생성 =========
    async createAlgo(createAlgoDto: CreateAlgoDto, user: any): Promise<Algorithm> {
        const { title, platform, difficulty, tags, approach, memo, solvedAt, timeSpent, problemUrl } = createAlgoDto;
        const newAlgo = this.algoRepository.create({
            title,
            platform,
            difficulty,
            tags,
            approach,
            memo,
            solvedAt,
            timeSpent,
            problemUrl,
            userId: user.sub, // JWT payload의 sub 필드 (사용자 ID)
        });
        return this.algoRepository.save(newAlgo);
    }

    // 2: READ - 알고리즘 조회 =========
    async findAllAlgos(queryDto: QueryAlgoDto): Promise<{ items: Algorithm[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
        const { page = 1, limit = 10, title, difficulty, tag, platform } = queryDto;
        const queryBuilder = this.algoRepository.createQueryBuilder('algo');

        // 검색어 필터링
        if (title) {
            queryBuilder.andWhere('algo.title ILIKE :title', { title: `%${title}%` });
        }
        if (difficulty) {
            queryBuilder.andWhere('algo.difficulty = :difficulty', { difficulty });
        }
        if (tag) {
            queryBuilder.andWhere('algo.tags @> :tag', { tag: [tag] });
        }
        if (platform) {
            queryBuilder.andWhere('algo.platform = :platform', { platform });
        }

        // 페이지네이션
        const [items, total] = await queryBuilder
            .skip((page - 1) * limit) // 건너뛸 개수 - ex) page=2, limit=10 -> skip=10
            .take(limit) // 가져올 개수 - ex) limit=10
            .orderBy('algo.createdAt', 'DESC') // 최신순 정렬
            .getManyAndCount(); // 결과와 총 개수를 동시에 반환

        // 결과 포맷팅
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

    // 단일 항목 상세 조회
    async findOneAlgo(id: number): Promise<Algorithm> {
        const algo = await this.algoRepository.findOne({ where: { id } });
        // 해당 ID의 알고리즘 없으면,
        if (!algo) {
            throw new NotFoundException(`Algorithm with ID ${id} not found`);
        }
        /* 추후 권한 체크 추가 */
        return algo;
    }

    // 3: UPDATE - 알고리즘 수정 =========
    async updateAlgo(id: number, updateAlgoDto: UpdateAlgoDto): Promise<Algorithm> {
        const algo = await this.findOneAlgo(id);
        Object.assign(algo, updateAlgoDto);
        return this.algoRepository.save(algo);
    }

    // 4: DELETE - 알고리즘 삭제 =========
    async deleteAlgo(id: number): Promise<void> {
        const result = await this.algoRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Algorithm with ID ${id} not found`);
        }
    }
}