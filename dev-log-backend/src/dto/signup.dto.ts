import {
	IsEmail,
	IsString,
	IsNotEmpty,
	MinLength,
	MaxLength,
	Matches,	// 정규표현식 패턴 확인
} from 'class-validator';

export class SignupDto {

	@IsEmail({}, { message: '올바른 이메일 형식이 아닙니다,.' })
	@IsNotEmpty({ message: '이메일은 필수입니다' })
	email: string;

	@IsString()
	@MinLength(1, { message: '비밀번호를 입력해주세요' }) // 개발용: 최소 1자 (배포 시 8자로 변경)
	@IsNotEmpty({ message: '비밀번호는 필수입니다' })
	pwd: string;

	@IsString()
	@MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
	@MaxLength(20, { message: '이름은 최대 20자까지 가능합니다' })
	@IsNotEmpty({ message: '이름은 필수입니다' })
	name: string;
}