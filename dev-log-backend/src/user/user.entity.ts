import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
//typeorm에게 이 클래스가 users 테이블과 매핑됨을 알림
export class user {
	@PrimaryGeneratedColumn() // 자동으로 1씩 증가하는 숫자형 기본키 (Primary Key)
	id: number; // INSERT 시 자동으로 ID 할당
	
	@Column({unique: true}) //중복 값 저장 불가 (이메일 중복 방지)
	email: string;

	@Column()
	pwd: string; //해시된 비밀번호 저장

	@Column()
	name: string;
}