import { Entity, // 이 클래스가 DB인거 표시
		Column, // 테이블 열 정의
		PrimaryGeneratedColumn, // 자동으로 증가하는 ID (primary-key)
		CreateDateColumn, // 생성 시간 자동 등록
		UpdateDateColumn, // 수정 시간 자동 기록
		Unique, // 중복되면 안되는 값
} from 'typeorm';

@Entity('users') //테이블 이름: users
//typeorm에게 이 클래스가 users 테이블과 매핑됨을 알림
export class User {
	@PrimaryGeneratedColumn() // 자동으로 1씩 증가하는 숫자형 기본키 (Primary Key)
	id: number; // INSERT 시 자동으로 ID 할당
	
	@Column({ unique: true }) //중복 값 저장 불가 (이메일 중복 방지)
	email: string;

	@Column()
	pwd: string; //해시된 비밀번호 저장

	@Column()
	name: string;

	@Column({ nullable:true })
	profileImage?: string;	//profile-img URL

	@Column({ default: true })
	isActive: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updateAt: Date;
}