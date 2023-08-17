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
	NotFoundException,
	Req,
	Res
} from '@nestjs/common';
import { User } from '../typeorm/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guard';
import {Request, Response}  from 'express';
import PartialJwtGuard from 'src/auth/guards/auth-partial-jwt.guard';
@Controller('users')
export class UsersController { 
	constructor(private usersService: UsersService ){}

	// @UseGuards(JwtAuthGuard)
	@UseGuards(PartialJwtGuard)
	@Get('/whoami')
	whoAmI(@CurrentUser() user: User, @Res() res: Response) {//user CurrentUser Decorator -> extract user from request
		res.json(user);
		return user;
	}

	@Post('/test')
	test(){
		console.log("test post users/test/")
	}

	@Get('/:id')
	async findUserById(@Param('id') id: string, @Req() req: Request){
		console.log(req);
//		console.log("GET PARAM called");
		console.log("Handler is running");
		const user : User = await this.usersService.findUserById(parseInt(id));
		if (!user) {
		  throw new NotFoundException('user not found');
		}
		return user;
	}

	@Get('/intraId/:intraId')
	async findUserByIntraId(@Param('intraId') intraId: string){
//		console.log("GET PARAM called");
		console.log("Handler is running");
		const user = await this.usersService.findUserByIntraId(intraId);
		if (!user) {
			return (null);
//		  throw new NotFoundException('user not found');
		}
		return user;
	}

	@Get('/nickname/:nickname')
	async findUserByNick(@Param('nickname') nickname: string){
//		console.log("GET PARAM called");
		console.log("Handler is running");
		const user = await this.usersService.findUserByNick(nickname);
		if (!user) {
			return (null);
//		  throw new NotFoundException('user not found');
		}
		return user;
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
		return this.usersService.update(parseInt(id), body);
	}
}
