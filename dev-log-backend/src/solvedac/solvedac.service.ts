// src/solvedac/solvedac.service.ts
// solved.ac API 호출 서비스
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SolvedacService {
    private readonly SOLVED_AC_API = 'https://solved.ac/api/v3';

    // 사용자 정보 조회
    async getUser(handle: string) {
        try {
            const response = await axios.get(`${this.SOLVED_AC_API}/user/show`, {
                params: { handle }
            });
            return response.data;
        } catch (error) {
            throw new HttpException(
                '존재하지 않는 백준 아이디입니다.',
                HttpStatus.NOT_FOUND
            );
        }
    }
}
