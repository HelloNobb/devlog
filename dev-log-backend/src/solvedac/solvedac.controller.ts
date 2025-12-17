// src/solvedac/solvedac.controller.ts
// solved.ac API 프록시 - CORS 우회용
import { Controller, Get, Query } from '@nestjs/common';
import { SolvedacService } from './solvedac.service';

@Controller('solvedac')
export class SolvedacController {
    constructor(private readonly solvedacService: SolvedacService) { }

    // GET /solvedac/user?handle=백준아이디
    @Get('user')
    async getUser(@Query('handle') handle: string) {
        return this.solvedacService.getUser(handle);
    }
}
