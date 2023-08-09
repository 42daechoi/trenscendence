import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { BadRequestException } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from "util";
import { FortytwoStrategy } from "./strategy/fortytwo.strategy";
import { LocalStrategy } from "./strategy/local.startegy";
import {JwtService} from "@nestjs/jwt";
import { TokenPayload, TokenType } from "./interfaces/token-payload.interface";
import { User } from "src/typeorm";

@Injectable()
export class AuthService{

	constructor(private usersService: UsersService, private jwtService: JwtService){}

//	async kakaoLoginAuth(code: string, domain : string){
//		const kakao_user = await this.kakaostrategy.kakaoLogin({code, domain});
//		return kakao_user;
//	}

	async signup(intraId: string) {
		// See if email is in use
		const users = await this.usersService.findUserByIntraId(intraId);
		if (users) {
			throw new BadRequestException('Intra Id is in use');
		}
		// Hash the users password
		// Generate a salt

		// Create a new user and save it. user servive makes entity and saves it
		const user = await this.usersService.create(intraId);
		//after updating signup process, change create user with create user DTO
		//const user = await this.usersService.create(intraId);

		// return the user
		return user;
	}


	async signin(intraId : string){
		//find returns list. how can pick the one?
		//비구조화 할당
		//findUserByIntraId will return array
		const user = await this.usersService.findUserByIntraId(intraId);
		if (!user) {
		  throw new NotFoundException('user not found');
		}
		return user;
	}

	//find user and make his token
	async validateUser(intraId: string) : Promise<any | null>{
		const user = await this.usersService.findUserByIntraId(intraId);
			console.log("checking user : " + user);
		if (user)
		{
			console.log("checking existing : " + user.intraId);
			const { intraId, ...rest} = user;
			const payload: TokenPayload = { 
				sub: user.id, 
				intraId: user.intraId, 
				type : TokenType.FULL
			};
			return {accessToken: this.jwtService.sign(payload)};
		}
		else
			return null;
	}

	async tokenValidateUser(payload: TokenPayload): Promise<User| undefined> {
        return await this.usersService.findUserByIntraId(payload.intraId);
    }
	
	async existUser(intraId : string) : Promise<any | null>{
		const user = await this.usersService.findUserByIntraId(intraId);
			console.log("checking user : " + user);
		if (user)
		{
			console.log("checking existing : " + user.intraId);
			const { intraId, ...rest} = user;
			return (user);
		}
		else
			return null;
	}
}
