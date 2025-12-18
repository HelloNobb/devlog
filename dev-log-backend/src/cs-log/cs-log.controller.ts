import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { CsLogService } from './cs-log.service';
import { CreateCsLogDto } from './dto/create-cs-log.dto';
import { UpdateCsLogDto } from './dto/update-cs-log.dto';
import { QueryCsLogDto } from './dto/query-cs-log.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CsLog } from './entities/cs-log.entity';

@Controller('cs-logs')
@UseGuards(JwtAuthGuard)
export class CsLogController {
    constructor(private readonly csLogService: CsLogService) { }

    @Post()
    create(@Body() createCsLogDto: CreateCsLogDto, @Request() req): Promise<CsLog> {
        return this.csLogService.createCsLog(createCsLogDto, req.user);
    }

    @Get()
    findAll(@Query() queryDto: QueryCsLogDto, @Request() req): Promise<{ items: CsLog[]; meta: any }> {
        return this.csLogService.findAllCsLogs(queryDto, req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<CsLog> {
        return this.csLogService.findOneCsLog(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCsLogDto: UpdateCsLogDto): Promise<CsLog> {
        return this.csLogService.updateCsLog(+id, updateCsLogDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.csLogService.deleteCsLog(+id);
    }
}
