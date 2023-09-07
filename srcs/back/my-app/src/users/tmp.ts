import {
  Body,
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
  Res,
  UploadedFile,
} from '@nestjs/common';
import { User } from '../typeorm/user.entity';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guard';
import { Request, Response } from 'express';
import PartialJwtGuard from 'src/auth/guards/auth-partial-jwt.guard';
import { currentAuthUser } from 'src/auth/decorators/auth-user.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { profile } from 'console';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@currentAuthUser() user: User, @Res() res: Response) {
    //user CurrentUser Decorator -> extract user from request
    res.json(user);
    return user;
  }
  @UseGuards(PartialJwtGuard)
  @Get('/OTPwhoami')
  OTPwhoAmI(@CurrentUser() user: User, @Res() res: Response) {
    //user CurrentUser Decorator -> extract user from request
    res.json(user);
    return user;
  }

  @UseGuards(PartialJwtGuard)
  @Get('/OTPwhoami')
  whoAmIforOTP(@CurrentUser() user: User, @Res() res: Response) {
    //user CurrentUser Decorator -> extract user from request
    res.json(user);
    return user;
  }

  @Post('/test')
  test() {
    console.log('test post users/test/');
  }

  @Get('id/:id')
  async findUserById(@Param('id') id: string, @Req() req: Request) {
    //		console.log(req);
    //		console.log("GET PARAM called");
    //		console.log("Handler is running");
    const user: User = await this.usersService.findUserById(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('/intraId/:intraId')
  async findUserByIntraId(@Param('intraId') intraId: string) {
    //		console.log("GET PARAM called");
    console.log('Handler is running');
    const user = await this.usersService.findUserByIntraId(intraId);
    if (!user) {
      return null;
      //		  throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get('/nickname/:nickname')
  //	@UseGuards(JwtAuthGuard)
  async findUserByNick(@Param('nickname') nickname: string) {
    //		console.log("GET PARAM called");
    console.log('Handler is running');
    const user = await this.usersService.findUserByNick(nickname);
    if (!user) {
      return null;
      //		  throw new NotFoundException('user not found');
    }
    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  //@UseGuards(JwtAuthGuard)
  // @Serialize(UpdateUserDto)
  updateUser(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateUserDto,
  ) {
    const contentType = req.headers['content-type'];

    let this_profilePicture;

    if (contentType === 'application/json' && body.profilePicture) {
      this_profilePicture = Buffer.from(body.profilePicture);
      return this.usersService.update(parseInt(id), {
        profilePicture: this_profilePicture,
      });
    }

    return this.usersService.update(parseInt(id), body);
  }

  @Get('findAll')
  //	@UseGuards(JwtAuthGuard)
  findAllUser() {
    return this.usersService.findAllUsers();
  }

  @Patch('/friends/add/:id')
  @UseGuards(JwtAuthGuard)
  async friendAdd(@CurrentUser() user: User, @Param('id') id: string) {
    //add freinds
    await this.usersService.addFriends(user.id, parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/friends/remove/:id')
  async friendRemove(@CurrentUser() user: User, @Param('id') id: string) {
    await this.usersService.removeFriends(user.id, parseInt(id));
  }

  @Get('/friends/list')
  @UseGuards(JwtAuthGuard)
  async friendsList(@CurrentUser() user: User): Promise<User[] | null> {
    const friends: User[] | null = await this.usersService.getUserFriends(
      user.id,
    );
    return friends;
  }

  @Patch('/blocks/add/:id')
  @UseGuards(JwtAuthGuard)
  async blockAdd(@CurrentUser() user: User, @Param('id') id: string) {
    //add freinds
    await this.usersService.addBlocks(user.id, parseInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/blocks/remove/:id')
  async blockRemove(@CurrentUser() user: User, @Param('id') id: string) {
    await this.usersService.removeBlocks(user.id, parseInt(id));
  }

  @Get('/blocks/list')
  @UseGuards(JwtAuthGuard)
  async blocksList(@CurrentUser() user: User): Promise<User[] | null> {
    const blocks: User[] | null = await this.usersService.getUserBlocks(
      user.id,
    );
    return blocks;
  }
}