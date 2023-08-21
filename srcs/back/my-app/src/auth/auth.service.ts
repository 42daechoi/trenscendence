import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { BadRequestException, Res, Req } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { FortytwoStrategy } from "./strategy/fortytwo.strategy";
import { LocalStrategy } from "./strategy/local.startegy";
import {JwtService} from "@nestjs/jwt";
import { TokenPayload, TokenType } from "./interfaces/token-payload.interface";
import { User } from "src/typeorm";
import {CreateUserDto} from "src/users/dtos/create-user.dto";
import { Response, Request } from "express";

@Injectable()
export class AuthService{

	constructor(private usersService: UsersService, private jwtService: JwtService){}

	async signup(body : any) : Promise<User>{
		// See if email is in use
		const users = await this.usersService.findUserByIntraId(body.intraId);
		if (users) {
			throw new BadRequestException('Intra Id is in use');
		}
		// Hash the users nickname
		// Generate a salt

		// Create a new user and save it. user servive makes entity and saves it
		const user = await this.usersService.createUser(body);
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
	async validateUser(intraId: string, type: TokenType) : Promise<any | null>{
		const user = await this.usersService.findUserByIntraId(intraId);
		console.log("checking user : " + user);
		if (user)
		{
			console.log("checking existing : " + user.intraId);
			const { intraId, ...rest} = user;
			const payload: TokenPayload = { 
				id: user.id, 
				intraId: user.intraId, 
				type : type
			};
			console.log("attaching Token\n"+ JSON.stringify(payload));
			return {accessToken: this.jwtService.sign(payload)};
		}
		else
			return null;
	}

	async tokenValidateUser(payload: TokenPayload): Promise<User| undefined> {
        return await this.usersService.findUserByIntraId(payload.intraId);
    }

	async setJwtCookie(res: Response, token: string): Promise<void> {
		res.cookie('jwt', token, {
		  httpOnly: true,
		  maxAge: 24 * 60 * 60 * 1000,
		});
	}

	async destoryJwtCookie(res: Response): Promise<Response> {
		res.cookie('jwt', '', {
			maxAge: 0
		})
		res.clearCookie('jwt');	
		return res.send({
			message: 'sign out success'
		})
	}

	async setJwtHeader(res: Response, token: string): Promise<void> {
		res.setHeader('Authorization', 'Bearer ' + token);
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
