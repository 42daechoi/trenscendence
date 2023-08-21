import { Module, forwardRef } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import {UsersModule} from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Games} from 'src/typeorm/game.entity';
import { GamePlayer } from 'src/typeorm/gamePlayer.entity';
import { User } from 'src/typeorm';

@Module({
	imports: [
		forwardRef(() => AuthModule),
		forwardRef(() => UsersModule),
	  	TypeOrmModule.forFeature([Games, GamePlayer, User])],
	controllers: [GameController],
	providers: [GameService, GameGateway]
})
export class GameModule {}
