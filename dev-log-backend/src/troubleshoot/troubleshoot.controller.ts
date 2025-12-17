// src/troubleshoot/troubleshoot.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { TroubleshootService } from './troubleshoot.service';
import { CreateTroubleshootDto } from './dto/create-troubleshoot.dto';
import { UpdateTroubleshootDto } from './dto/update-troubleshoot.dto';
import { QueryTroubleshootDto } from './dto/query-troubleshoot.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Troubleshoot } from './entities/troubleshoot.entity';

@Controller('troubleshoots')
@UseGuards(JwtAuthGuard)
export class TroubleshootController {
    constructor(private readonly troubleshootService: TroubleshootService) { }

    @Post()
    create(@Body() createDto: CreateTroubleshootDto, @Request() req): Promise<Troubleshoot> {
        return this.troubleshootService.createTroubleshoot(createDto, req.user);
    }

    @Get()
    findAll(@Query() queryDto: QueryTroubleshootDto): Promise<{ items: Troubleshoot[]; meta: any }> {
        return this.troubleshootService.findAllTroubleshoots(queryDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Troubleshoot> {
        return this.troubleshootService.findOneTroubleshoot(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateTroubleshootDto): Promise<Troubleshoot> {
        return this.troubleshootService.updateTroubleshoot(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.troubleshootService.deleteTroubleshoot(+id);
    }
}
