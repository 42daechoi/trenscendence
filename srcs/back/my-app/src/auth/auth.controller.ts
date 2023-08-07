import { Body, 
	Controller, 
	Post, 
	Get, 
	Patch, 
	Param, 
	Query, 
	Delete, 
	UseInterceptors,
	Session,
	UseGuards,
	Request,
	Response,
	BadRequestException,
	UnauthorizedException,
	Redirect

} from '@nestjs/common';
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
	@Redirect('http://localhost:3000/create-account', 302)
	async login42(@Request() req : any, @currentAuthUser() user: User, @Response({passthrough: true}) res : any){
		//we will get auth CODE for accessing public intra data.
		//let get data(intra id, profile pic) with code and
		//how to inform front? updating response!
		console.log("auth/loginfortytwo/callback")
//		console.log(req.user);
//		console.log(req.user.id);
//		console.log(req.user.login);
//		console.log(req.user.usual_full_name);
		const [intraId, intraIdNum, full_name, photo] = [res.req.user.login, res.req.user.id, res.req.user.usual_full_name, res.req.user.image];
		const find_user = await this.usersService.findUserByIntraId(intraId);
		const user_info = {intraId, intraIdNum, full_name, photo};

		//new user
		//wait for sign up requst
		if (!find_user)
		{
			console.log("new user logged in!");
			return { url: 'http://localhost:3000/create-account', statusCode: 302, user_info };
		}
		else
		{
			//jwt response attachment
			const user_find  = await this.authService.validateUser(intraId);
			res.setHeader('Authorization', 'Bearer '+user_find.accessToken);
			console.log(res);
			console.log("found user intraId in our database");
			return { url: 'http://localhost:3000/main', statusCode: 302, user_info };
		}
	}

	@Post('/signup')
	@Serialize(CreateUserDto)
	async createUser(@Body() body: CreateUserDto) {
		const user_intraId = body.intraId;
		console.log("In controller finding userid: " + user_intraId);
		//create new user
		const new_user = await this.authService.signup(user_intraId);
			//jwt response attachment
		return (new_user)
	}

	@Post('/signin')
	async signin(@Body() body : CreateUserDto, @Session() session : any){
		console.log("singin in Controller");
		const user = await this.authService.signin(body.intraId);
		session.userId = user.id;
		return user;
	}

	@Get('/authentication')
	@UseGuards(JwtAuthGuard)
	async isAuth(@Request() req) : Promise<any>{
		const user: any = req.user;
		return (user);
	}
}
