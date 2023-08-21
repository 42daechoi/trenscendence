import { 
	Injectable,
	Logger, 
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User, GamePlayer, Games } from 'src/typeorm';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import  {Game, Player1, Player2}  from './classes/game.class';
import { UserStatus } from 'src/typeorm/user.entity';

@Injectable()
export class GameService {
	private readonly logger = new Logger("GameService");
	constructor(
		private authService: AuthService,
		private userService: UsersService,
		@InjectRepository(Games) private gamesRepository: Repository<Games>,
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(GamePlayer) private gamePlayerRepository: Repository<GamePlayer>,
	){
		this.queue = new Map();
		this.gameSessions = new Map();
		this.newInvitationList = new Map();
	}
	public queue: Map<string, Socket>;//waiting Queue <K: socketId,  V: socket>
	public gameSessions: Map<string, Game>;//game class instance Queue. K: V:
	public newInvitationList: Map<number, { userIds: number[]; userSocket: Socket }[]>;

	async pushQueue(clientSocket: Socket){
		const client_user : User = await this.userService.findUserBySocketId(clientSocket.id); 
		//cannot find socket id User.
		if (!client_user){
			//not 
			this.logger.log("cannot find user");
		}
//		if (client_user.status !== UserStatus.Online){
//			this.logger.log("cannot find user is not online");
//		}
		this.queue.set(clientSocket.id, clientSocket);
		this.logger.log("cur size : " + this.queue.size);
		console.log("pushing in queue user id : " + client_user.id);
		if (this.queue.size === 2){
		
		}
	}

	async popQueue(clientSocket: Socket){
		const client_user : User = await this.userService.findUserBySocketId(clientSocket.id); 
		//cannot find socket id User.
		if (!client_user){
			//not 
			throw new Error("NotFoundException : cannot find user");
		}
		this.queue.delete(clientSocket.id);
		console.log("poping in queue user id : " + client_user.id);

	}

	async setUpGame(client1: Socket, client2: Socket, server: Server){
		const user1 : User = await this.userService.findUserBySocketId(client1.id);
		const user2 : User= await this.userService.findUserBySocketId(client2.id);
		const player1 : Player1 = new Player1(user1.socketId, user1.id, user1.nickname);
		const player2 : Player2 = new Player1(user2.socketId, user2.id, user2.nickname);
		const gameInfo = new Game(player1, player2);
		gameInfo.gameStatus = 'running';
//		server.emit('matchInfo', {player1 : user1, player2: user2});
		gameInfo.gameID = user1.id.toString();
		client1.join(gameInfo.gameID);
		client2.join(gameInfo.gameID);
		server.to(gameInfo.gameID).emit('matchInfo', {gameId: gameInfo.gameID, host : user1, guest: user2});

		/* add that game info to the gameSessions */
		this.gameSessions.set(gameInfo.gameID, gameInfo);

		/* send all active game sessions */
		const gameSessions = [];
		this.gameSessions.forEach((value: Game) => {
		  if (value.gameStatus === 'running') {
			gameSessions.push(value);
		  }
		});
	}

	async monitorQueue(server: Server) {
		if (this.queue.size === 2) {
			await this.matchUp(
				this.queue.get(Array.from(this.queue.keys())[0]),
				this.queue.get(Array.from(this.queue.keys())[1]),
				server
			);
		}
	}

	async matchUp(player1 : Socket, player2 : Socket, server: Server){
		await this.setUpGame(
			this.queue.get(Array.from(this.queue.keys())[0]),
			this.queue.get(Array.from(this.queue.keys())[1]),
			server,
		);
		this.queue.clear();
		//make a game.
		//match Info emit to player1
		//match Info emit to player2
	}

	async findGamebyHostId(host: Socket) : Promise<Games | null>{

		return null;
	}

	async updateGameSettingInfo(body : any){
		const cur_game : Game = this.gameSessions.get(body.gameId);

		//update gameInfo

		//emit to two players
	}
}
