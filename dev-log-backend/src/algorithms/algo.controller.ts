// 목적: 알고리즘 관련 API 정의 

// Controller: HTTP 요청/응답 처리 
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AlgoService } from './algo.service';
import { CreateAlgoDto } from './dto/create-algo.dto';
import { UpdateAlgoDto } from './dto/update-algo.dto';
import { QueryAlgoDto } from './dto/query-algo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Algorithm } from './entities/algo.entity';

@Controller('algorithms') // 라우트 기본 경로
@UseGuards(JwtAuthGuard)
export class AlgoController {
    constructor(private readonly algoService: AlgoService) { }

    // CREATE ========
    @Post()
    async createAlgo(@Body() createAlgoDto: CreateAlgoDto, @Request() req): Promise<Algorithm> {
        return this.algoService.createAlgo(createAlgoDto, req.user);
    }

    // READ ========
    @Get()
    async findAllAlgos(@Query() queryDto: QueryAlgoDto):
        Promise<{
            items: Algorithm[];
            meta: { total: number; page: number; limit: number; totalPages: number }
        }> {
        return this.algoService.findAllAlgos(queryDto);
    }

    @Get(':id')
    async findOneAlgo(@Param('id') id: number): Promise<Algorithm> {
        return this.algoService.findOneAlgo(id);
    }

    // UPDATE ========
    @Patch(':id')
    async updateAlgo(@Param('id') id: number, @Body() updateAlgoDto: UpdateAlgoDto): Promise<Algorithm> {
        return this.algoService.updateAlgo(id, updateAlgoDto);
    }

    // DELETE ========
    @Delete(':id')
    async deleteAlgo(@Param('id') id: number): Promise<void> {
        return this.algoService.deleteAlgo(id);
    }
}