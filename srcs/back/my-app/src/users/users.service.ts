import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {UserDto} from './dtos/users.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from "util";
const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	async createUser(createUserDto: CreateUserDto) {
		//creating has type checking with dto

		var tempNick : string = createUserDto.intraId;
		const salt = randomBytes(8).toString('hex');

		// Hash the salt and the password together
		// async crypto
		const hash = (await scrypt(tempNick, salt, 16)) as Buffer;
		let attrs: Partial<User>
		tempNick = 'USER@' + hash.toString('hex');
		createUserDto.nickname = tempNick;
		// Join the hashed result and the salt together
		const newUser = this.userRepository.create(createUserDto);

		//return this.repo.save(email, password);//not executing hooks -> no logs
		//create vs save
		//creating is make an instance of entity
		//saving is stroing in db
		return this.userRepository.save(newUser);
	}

	create(intraId:string) {
		const user = this.userRepository.create( {intraId} );
		//how about type checking in saving?
		return this.userRepository.save(user);
		//return this.repo.save(email, password);//not executing hooks -> no logs
		//create vs save
		//creating is make an instance of entity
		//saving is stroing in db
	}
      
	async findUserById(id: number) : Promise<User | null> {
		return this.userRepository.findOneById(id);
	}

	async findUserByIntraId(findIntraId: string) : Promise<User | null> {
		//find all of entities with query
		//return array
		console.log("finding Intra ID in service : " + findIntraId);
		const user  = await this.userRepository.findOneBy({intraId: findIntraId});
		if (!user)
			return (null);
		return (user);
	}

	async findUserByNick(findNick: string) : Promise<User | null>{
		console.log("finding User by nickname in use service");
		const user  = await this.userRepository.findOneBy({nickname: findNick});
		if (!user)
			return (null);
		return (user);
	}

	async update(id: number, attrs: Partial<User>) {
		const user = await this.findUserById(id);
		if (!user) {
		  throw new NotFoundException('user not found');
		}
		// ######## IMPORTANT ########
		Object.assign(user, attrs);
		return this.userRepository.save(user);
	}

	async remove(id: number) {
		const user = await this.findUserById(id);
		if (!user) {
		  throw new NotFoundException('user not found');
		}
		return this.userRepository.remove(user);
	}
}
