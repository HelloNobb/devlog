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
	@IsNotEmpty({ message:'이메일은 필수입니다' })
	email: string;

	@IsString()
	@MinLength(8, {message:'비밀번호는 최소 8자 이상입니다'})
	@MaxLength(20, { message: '비밀번호는 최대 20자까지 가능합니다' })
	@Matches(
		/^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*])/,
		{ message: '비밀번호는 영문, 숫자, 특수문자 중 2가지 이상 포함해야 합니다' }
	)
	@IsNotEmpty({ message: '비밀번호는 필수입니다' })
	pwd: string;

	@IsString()
	@MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다' })
	@MaxLength(20, { message: '이름은 최대 20자까지 가능합니다' })
	@IsNotEmpty({ message: '이름은 필수입니다' })
	name: string;
}