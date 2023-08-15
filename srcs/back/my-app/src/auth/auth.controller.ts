import { Body, 
	Controller, 
	Post, 
	Get, 
	Patch, 
	Param, 
	Query, 
	Delete, 
	UseInterceptors,
	UseGuards,
	BadRequestException,
	UnauthorizedException,
	Redirect,
	Req,
	Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {AuthService} from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import {UsersService} from 'src/users/users.service';
import {Serialize} from 'src/interceptors/serialize.interceptor';
import {UserDto} from 'src/users/dtos/users.dto';
import {FortyTwoAuthGuard} from './guards/auth.fortytwoGuard';
import { FortytwoStrategy } from './strategy/fortytwo.strategy';
import {currentAuthUser} from './decorators/auth-user.decorator';
import { User } from 'src/typeorm';
import {LocalAuthGuard} from './guards/auth-local.guard';
import {AuthGuard} from '@nestjs/passport';
import {JwtAuthGuard} from './guards/auth-jwt.guard';
import { TokenType } from './interfaces/token-payload.interface';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService : UsersService){}

	//42login
	@UseGuards(FortyTwoAuthGuard)
	@Get('loginfortytwo/callback')
	async login42(@Req() req : Request, @Res({passthrough: true}) res : any){
		//we will get auth CODE for accessing public intra data.
		console.log("auth/loginfortytwo/callback")
		const intraId :string = res.req.user.login;
		const nickname :string = res.req.user.login;
		let find_user : User = await this.usersService.findUserByIntraId(intraId);
		if (!find_user)
		{
			console.log("new user logged in!");
			//this gonna be create user dto soon.
			find_user = await this.usersService.createUser({intraId, nickname});
		}
		//ticket a token to user
		//give the token to user Response Header
		const user : User = find_user;
		const twoFA: boolean = user.twoFA;
		let tokenType : TokenType;
		tokenType = (twoFA == true) ? TokenType.PARTIAL: TokenType.FULL;
		//ticket a token to user
		const user_token = await this.authService.validateUser(user.intraId, tokenType);
		//bake cookie
		this.authService.setJwtCookie(res, user_token.accessToken);
		//redirect to 2FA
		//#################################
		//#########     2FA     ###########
		//#################################
		if (user.twoFA == true){
			return res.redirect('http://localhost:3000/main');
		}
		if (user.currentAvatarData == false){
			return res.redirect('http://localhost:3000/create-account');
		}
		else{
			return res.redirect('http://localhost:3000/main');
		}
		//else redirect to main page
	}

	@Post('/signup')
	@Serialize(CreateUserDto)
	async createUser(@Body() body: CreateUserDto) {
		const user_intraId = body.intraId;
		console.log("In auth controller finding userid: " + user_intraId);
		//create new user
		const new_user = await this.authService.signup(body);
			//jwt response attachment
		return (new_user)
	}

	@Post('/signin')
	async signin(@Body() body : any, @Res() res : Response){
		console.log("singin in Controller");
		let find_user : User = await this.usersService.findUserByIntraId(body.intraId);
		const intraId : string = body.intraId;
		const nickname : string = body.intraId;
		if (!find_user)
		{
			console.log("new user logged in!");
			//this gonna be create user dto soon.
			find_user = await this.usersService.createUser({intraId, nickname});
		}
		const user : User = find_user;
		const twoFA: boolean = user.twoFA;
		let tokenType : TokenType;
		tokenType = (twoFA == true) ? TokenType.PARTIAL: TokenType.FULL;
		//ticket a token to user
		const user_token = await this.authService.validateUser(user.intraId, tokenType);
		//bake cookie
		this.authService.setJwtCookie(res, user_token.accessToken);
		//redirect to 2FA
		//#################################
		//#########     2FA     ###########
		//#################################
//		if (user.twoFA == true){
//			return res.redirect('http://localhost:3000/main');
//		}
//		if (user.currentAvatarData == false){
//			return res.redirect('http://localhost:3000/create-account');
//		}
//		else{
//			return res.redirect('http://localhost:3000/main');
//		}
		//else redirect to main page
		return res.json(user_token);
	}

	@Get('/authentication')
	@UseGuards(JwtAuthGuard)
	async isAuth(@Req() req: Request, @Res() res: Response) : Promise<any>{
		console.log("checking Authentication user in request")
		const user: any = req.user;
		res.json(user);
		return (user);
	}

	@Get('/cookies')
	@UseGuards(JwtAuthGuard)
	getCookies(@Req() req: Request, @Res() res: Response): any {
        const jwt = req.cookies['jwt'];
//		res.status(200).send('Custom response');
        return res.status(200).send(jwt);
    }

	@Post('/signout')
	@UseGuards(JwtAuthGuard)
	async signOut(@Req() req : Request, @Res() res : Response) : Promise<any> {
		return (await this.authService.destoryJwtCookie(res));
	}
}
