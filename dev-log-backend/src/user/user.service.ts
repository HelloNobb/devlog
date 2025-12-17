// user-service (db작업)
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService{
	constructor(
		@InjectRepository(User) // Repository: TypeORM에서 제공하는 DB 작업 헬퍼 클래스
		private userRepository: Repository<User>,
	){}

	async findByEmail(email: string): Promise<User | null>{
		return this.userRepository.findOne({ // SQL: SELECT * FROM users WHERE email = 'email' LIMIT 1
			where: { email }
		});
	}

	// async create(email: string, pwd: string, name: string): Promise<User>{
	// 	// 새 유저 생성 (회원가입 처리)
		
	// }
}