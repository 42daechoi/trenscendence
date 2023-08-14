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

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private usersService : UsersService){}

	//42login
	@UseGuards(FortyTwoAuthGuard)
	@Get('loginfortytwo/callback')
	async login42(@Req() req : Request, @Res({passthrough: true}) res : any){
		//we will get auth CODE for accessing public intra data.
		//let get data(intra id, profile pic) with code and
		console.log("auth/loginfortytwo/callback")
//		const [intraId, intraIdNum, full_name, photo] = [res.req.user.login, res.req.user.id, res.req.user.usual_full_name, res.req.user.image];
		const intraId :string = res.req.user.login;
		const nickname :string = res.req.user.login;
		let find_user : User = await this.usersService.findUserByIntraId(intraId);
//		console.log(user_info.intraId);
		//can i redirect twice? (loading page)
//		res.redirect('http://localhost:3000/loading');
		if (!find_user)
		{
			console.log("new user logged in!");
			//this gonna be create user dto soon.
			find_user = await this.usersService.createUser({intraId, nickname});
		}
		//#############################################
		//##########       JWT TOKEN        ###########
		//#############################################
		//ticket a token to user
		const user_token = await this.authService.validateUser(find_user.intraId);
		//give the token to user Response Header
		this.authService.setJwtHeader(res, user_token.accessToken);
//		res.json(user_token);
		//#############################################
		//##########       COOKIES        #############
		//#############################################
		//give the token to user Cookie in Response
		this.authService.setJwtCookie(res, user_token.accessToken);
		//redirect to avatar setting
		if (find_user.currentAvatarData == false){
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
		const user = await this.authService.signin(body.intraId);
		//#############################################
		//##########       JWT TOKEN        ###########
		//#############################################
		//ticket a token to user
		const user_token = await this.authService.validateUser(user.intraId);
		//give the token to user Response Header
		this.authService.setJwtHeader(res, user_token.accessToken);
//		res.json(user_token);
		//#############################################
		//##########       COOKIES        #############
		//#############################################
		//give the token to user Cookie in Response
		this.authService.setJwtCookie(res, user_token.accessToken);
		return res.json(user_token);
	}

	@Get('/authentication')
	@UseGuards(JwtAuthGuard)
	async isAuth(@Req() req, @Res() res) : Promise<any>{
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
		this.authService.destoryJwtCookie(res);
		return res.send({
			message: 'sign out success'
		})
	}
}
