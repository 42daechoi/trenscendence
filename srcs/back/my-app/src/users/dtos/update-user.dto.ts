import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { User } from 'src/typeorm';

export class UpdateUserDto {

	@IsString()
	@IsOptional()
	nickname: string;

	@IsOptional()
	friends: User[];

	@IsOptional()
	@IsNumber()
	wins: number;

	@IsOptional()
	@IsNumber()
	loses: number;

	@IsOptional()
	@IsNumber()
	rate: number;

	@IsOptional()
	@IsNumber()
	rank: number;

	@IsOptional()
	@IsBoolean()
	currentAvatarData: boolean;

	@IsOptional()
	@IsBoolean()
	twoFA: boolean;

	@IsString()
	@IsOptional()
	twoFASecret: string;


}
