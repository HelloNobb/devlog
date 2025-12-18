// src/troubleshoot/troubleshoot.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Troubleshoot } from './entities/troubleshoot.entity';
import { CreateTroubleshootDto } from './dto/create-troubleshoot.dto';
import { UpdateTroubleshootDto } from './dto/update-troubleshoot.dto';
import { QueryTroubleshootDto } from './dto/query-troubleshoot.dto';

@Injectable()
export class TroubleshootService {
    constructor(
        @InjectRepository(Troubleshoot)
        private troubleshootRepository: Repository<Troubleshoot>,
    ) { }

    // CREATE
    async createTroubleshoot(createDto: CreateTroubleshootDto, user: any): Promise<Troubleshoot> {
        const troubleshoot = this.troubleshootRepository.create({
            ...createDto,
            userId: user.sub,
        });
        return this.troubleshootRepository.save(troubleshoot);
    }

    // READ - 전체 조회 (페이징)
    async findAllTroubleshoots(queryDto: QueryTroubleshootDto, userId: number): Promise<{
        items: Troubleshoot[];
        meta: { total: number; page: number; limit: number; totalPages: number };
    }> {
        const { page = 1, limit = 10 } = queryDto;
        const skip = (page - 1) * limit;

        const [items, total] = await this.troubleshootRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
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

    // READ - 단일 조회
    async findOneTroubleshoot(id: number): Promise<Troubleshoot> {
        const item = await this.troubleshootRepository.findOne({ where: { id } });
        if (!item) {
            throw new NotFoundException(`Troubleshoot #${id} not found`);
        }
        return item;
    }

    // UPDATE
    async updateTroubleshoot(id: number, updateDto: UpdateTroubleshootDto): Promise<Troubleshoot> {
        await this.findOneTroubleshoot(id);
        await this.troubleshootRepository.update(id, updateDto);
        return this.findOneTroubleshoot(id);
    }

    // DELETE
    async deleteTroubleshoot(id: number): Promise<void> {
        const result = await this.troubleshootRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Troubleshoot #${id} not found`);
        }
    }
}
