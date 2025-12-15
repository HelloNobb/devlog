import { Controller, Get, Post, Body, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
//import { User } from '../user/user.entity';

@Controller('user')
export class UserController{
	//주입식 생성자
	constructor(private userService: UserService){}
}