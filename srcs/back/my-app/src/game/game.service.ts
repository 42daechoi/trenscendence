import { 
	Injectable,
	Logger, 
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User, GamePlayer, Games } from 'src/typeorm';
import { Server, Socket, Namespace } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import  {Game, Player1, Player2, PlayerStatus}  from './classes/game.class';
import { UserStatus } from 'src/typeorm/user.entity';

@Injectable()
export class GameService {
	private readonly logger = new Logger("GameService");
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
		@InjectRepository(Games) private gamesRepository: Repository<Games>,
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(GamePlayer) private gamePlayerRepository: Repository<GamePlayer>,
	){
		this.queue = new Map();
		this.usersSockets = new Map();
		this.gameSessions = new Map();
		this.newInvitationList = new Map();
	}
	public queue: Map<string, Socket>;//waiting Queue <K: socketId,  V: socket>
	public usersSockets: Map<string, Socket>;//waiting Queue <K: socketId,  V: socket>
	public gameSessions: Map<string, Game>;//game class instance Queue. K: V:
	public newInvitationList: Map<number, { userIds: number[]; userSocket: Socket }[]>;

	async pushQueue(clientSocket: Socket){
		const client_user : User = await this.usersService.findUserBySocketId(clientSocket.id); 
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
		const client_user : User = await this.usersService.findUserBySocketId(clientSocket.id); 
		//cannot find socket id User.
		if (!client_user){
			//not 
			throw new Error("NotFoundException : cannot find user");
		}
		this.queue.delete(clientSocket.id);
		console.log("poping in queue user id : " + client_user.id);

	}

	async setUpGame(client1: Socket, client2: Socket, server: Server){
		const user1 : User = await this.usersService.findUserBySocketId(client1.id);
		const user2 : User= await this.usersService.findUserBySocketId(client2.id);
		const player1 : Player1 = new Player1(user1.socketId, user1.id, user1.nickname);
		const player2 : Player2 = new Player1(user2.socketId, user2.id, user2.nickname);
		const gameInfo = new Game(player1, player2);
		gameInfo.gameStatus = 'running';
		gameInfo.gameID = user1.socketId;
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
		this.queue.delete(player1.id);
		this.queue.delete(player2.id);
		//make a game.
		//match Info emit to player1
		//match Info emit to player2
	}

	async findGamebyHostId(host: Socket) : Promise<Games | null>{

		return null;
	}

	async echoRoom(client: Socket, server: Server, body: any){
		const cur_game_id = await this.getCurGameRoomId(client);
		server.to(cur_game_id).emit("setupReply", body);
//		client.emit('setupReply', body);
	}

	async echoRoomByGameHost(client: Socket, server: Server, body: any){
		const room = Array.from(client.rooms);
		console.log(room);
		const gameRoom = this.gameSessions.get(client.id);
		if (gameRoom && gameRoom.gameID === client.id)
			server.to(client.id).emit("setupReply", body);
//		client.emit('setupReply', body);
	}

	async updateGameSettingInfo(body : any){
		const cur_game : Game = this.gameSessions.get(body.gameId);
		//update gameInfo

		//emit to two players
	}

	async getCurGameRoomId(client: Socket){
		const room = Array.from(client.rooms);
		if (room.length == 1)
			return room[0];
		else
			return room[1];
	}

	async updatePlayerInfo(client: Socket, body: Partial<Game>){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
		let cur_player = cur_game_id === client.id ? cur_game.host : cur_game.guest;
		this.logger.log("update game info of player" + cur_player.socketID);
	}

	async playerReady(client: Socket, nsp : Namespace){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game  = this.gameSessions.get(cur_game_id);
		let cur_player = cur_game_id === client.id ? cur_game.host : cur_game.guest;
		cur_player.playerStatus = PlayerStatus.Ready;
		cur_game.readyNum++;
		nsp.to(cur_game_id).emit("ready", { message: `Player ${cur_player.userID} is ready` });
		this.logger.log("Ready! from " + cur_game_id);
		if (cur_game.readyNum == 2)
		{
			this.logger.log("game is good to go!");
			nsp.to(cur_game_id).emit("allReady");
		}
	}

	async playerUnready(client: Socket){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
		let cur_player = cur_game_id === client.id ? cur_game.host : cur_game.guest;
		cur_player.playerStatus = PlayerStatus.Waiting;
		cur_game.readyNum--;
	}

	async userComeNsp(client: Socket){
		this.usersSockets.set(client.id, client);
	}

	async userOutNsp(client: Socket){
		this.usersSockets.delete(client.id);
	}

	async updateGameRoomInfo(client: Socket, body: any){

	}

	async updateUserStatusInGame(client: Socket){
		const user : User = await this.usersService.findUserBySocketId(client.id);
		this.usersService.update(user.id, {status: UserStatus.GAME})
	}

	async updateUserStatusOnline(client: Socket){
		const user : User = await this.usersService.findUserBySocketId(client.id);
		this.authService.updateUserStatusOnline(user);
	}

	async gameStart(client: Socket, nsp: Namespace){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
		const host : Player2 = cur_game.host;
		const guest : Player2 = cur_game.guest;
		guest.playerStatus = PlayerStatus.Playing;
		host.playerStatus = PlayerStatus.Playing;
		nsp.to(cur_game_id).emit('gameStart');
		const guestSocket : Socket = this.usersSockets.get(guest.socketID); 
		const hostSocket : Socket = this.usersSockets.get(host.socketID); 
	}

	async gameOver(clinet: Socket){

	}

	async destroyGame(client: Socket){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
		const guest : Player2 = cur_game.guest;
		const guestSocket : Socket = this.usersSockets.get(guest.socketID); 

		//disjoin guest socket
		guestSocket.leave(cur_game_id);

		//destory gameSession
		this.gameSessions.delete(cur_game_id);
	}

	testnsp(nsp: Namespace, socket: Socket, body: any){
		nsp.to(socket.id).emit("message", body);
	}
}
