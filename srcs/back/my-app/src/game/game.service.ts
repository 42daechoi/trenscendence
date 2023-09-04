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
import  {Game, Player1, Player2, PlayerStatus, PadItem, Ball, Obstacle, Collidable, GameStatus}  from './classes/game.class';
import { UserStatus } from 'src/typeorm/user.entity';
import { CreateGamePlayerDto } from './dtos/create-gamePlayer.dto';
import { Result } from './interfaces/game.interface';
import { response } from 'express';


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
			return ;
		}
//		if (client_user.status !== UserStatus.Online){
//			this.logger.log("cannot find user is not online");
//		}
		this.queue.set(clientSocket.id, clientSocket);
		this.logger.log("cur size : " + this.queue.size);
		console.log("pushing in queue user id : " + client_user.id);
	}

	async popQueue(clientSocket: Socket){
		const client_user : User | null = await this.usersService.findUserBySocketId(clientSocket.id); 
		//cannot find socket id User.
		if (!client_user){
			//not 
			return ;
			//throw new Error("NotFoundException : cannot find user");
		}
		if (this.queue.get(clientSocket.id))
		{
			this.queue.delete(clientSocket.id);
			console.log("poping in queue user id : " + client_user.id);
		}
	}

	async setUpGame(client1: Socket, client2: Socket, nsp: Namespace){
		const user1 : User = await this.usersService.findUserBySocketId(client1.id);
		const user2 : User = await this.usersService.findUserBySocketId(client2.id);
		const player1 : Player1 = new Player1(user1.socketId, user1.id, user1.nickname);
		const player2 : Player2 = new Player1(user2.socketId, user2.id, user2.nickname);
		const gameInfo = new Game(player1, player2);
		gameInfo.gameStatus = GameStatus.Waiting;
		gameInfo.gameID = user1.socketId;
		gameInfo.gameService = this;
		client1.join(gameInfo.gameID);
		client2.join(gameInfo.gameID);
		nsp.to(user1.socketId).emit('client', 0);
		nsp.to(user2.socketId).emit('client', 1);
		nsp.to(gameInfo.gameID).emit('matchInfo', {gameId: gameInfo.gameID, host : user1, guest: user2});
		/* add that game info to the gameSessions */
		this.gameSessions.set(gameInfo.gameID, gameInfo);
		this.logger.log("created game session, size : " + this.gameSessions.size);

//		/* send all active game sessions */
//		const gameSessions = [];
//		this.gameSessions.forEach((value: Game) => {
//		  if (value.gameStatus === GameStatus.Playing) {
//			gameSessions.push(value);
//		  }
//		});
	
	}

	async monitorQueue(nsp: Namespace) {
		if (this.queue.size === 2) {
			await this.matchUp(
				this.queue.get(Array.from(this.queue.keys())[0]),
				this.queue.get(Array.from(this.queue.keys())[1]),
				nsp
			);
		}
	}

	async matchUp(player1 : Socket, player2 : Socket, nsp: Namespace){
		await this.setUpGame(
			this.queue.get(Array.from(this.queue.keys())[0]),
			this.queue.get(Array.from(this.queue.keys())[1]),
			nsp,

		);
		this.queue.delete(player1.id);
		this.queue.delete(player2.id);
		//make a game.
		//match Info emit to player1
		//match Info emit to player2
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


	async userComeNsp(client: Socket){
		this.usersSockets.set(client.id, client);
	}

	async userOutNsp(client: Socket){
		this.logger.log("user has out of game " + client.id);
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
			this.usersSockets.delete(client.id);
			await this.updateUserStatusOnline(client);

	}

	async updateGameRoomInfo(client: Socket, body: any){

	}

	async updateUserStatusInGame(client: Socket){

		const user : User = await this.usersService.findUserBySocketId(client.id);
		if (!user)
			return ;
		this.usersService.update(user.id, {status: UserStatus.GAME})
	}

	async updateUserStatusOnline(client: Socket){
		const user : User = await this.usersService.findUserBySocketId(client.id);
		if (!user)
			return ;
		this.authService.updateUserStatusOnline(user);
	}

	  async getGameStatForPlayer(userID: number): Promise<Result[]> {
    const gameStats: GamePlayer[] = await this.gamePlayerRepository
      .createQueryBuilder('gamePlayer')
      .leftJoinAndSelect('gamePlayer.user', 'user')
      .leftJoinAndSelect('gamePlayer.game', 'game')
      .select(['gamePlayer.id', 'gamePlayer.score', 'gamePlayer.winner', 'user.intraId', 'game.id', 'game.date'])
      .orderBy('game.date', 'ASC')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .from(Games, 'game')
          .leftJoin('game.gamePlayer', 'gamePlayer')
          .leftJoin('gamePlayer.user', 'user')
          .select(['game.id'])
          .where('user.id = :id', { id: userID })
          .getQuery();
        return 'game.id IN ' + subQuery;
      })
      .getMany();

    let results: Result[] = [];
	console.log("gameStats", gameStats);

    for (let i: number = 0; i < gameStats.length - 1; i++) {
      if (gameStats[i].game.id == gameStats[i + 1].game.id) {
        let result = {
          key: i,
          date: gameStats[i].game.date.toDateString(),
          winner: gameStats[i].winner ? gameStats[i].user.intraId : gameStats[i + 1].user.intraId,
          loser: gameStats[i].winner ? gameStats[i + 1].user.intraId : gameStats[i].user.intraId,
          scoreWinner: gameStats[i].winner ? gameStats[i].score : gameStats[i + 1].score,
          scoreLoser: gameStats[i].winner ? gameStats[i + 1].score : gameStats[i].score,
        };
        results.push(result);
      }
    }
    return results;
  }


	async OneOnOneNoti(srcUserId : number, targetUserId: number, nsp: Namespace){
		const targetUser : User = await this.usersService.findUserById(targetUserId);
		const srcUser : User = await this.usersService.findUserById(srcUserId)
		//cannot find user`
		if (!targetUser || !srcUser){
			this.logger.log("cannot find target user of id : " + targetUserId);
		}
		//Not ONLINE
		if (targetUser.status === UserStatus.OFFLINE)
		{
			this.logger.log("Target User is OFFLINE. id: " + targetUserId);
		}
		//In Game
		if (targetUser.status === UserStatus.GAME)
		{
			this.logger.log("Target User is in Game. id: " + targetUserId);
		}
		//cannot find socket
		const targetSocket : Socket = this.usersSockets.get(targetUser.socketId);
		if (targetSocket)
			targetSocket.emit('OneOnOneNoti', {srcUser, targetUser});
	}

	async acceptOneOnOne(srcUser : User, targetUser : User, nsp : Namespace){
		const hostSocket : Socket = this.usersSockets.get(srcUser.socketId);
		const guestSocket : Socket = this.usersSockets.get(targetUser.socketId);
		await this.setUpGame(hostSocket, guestSocket, nsp);
	}

	async denyOneOnOne(srcUser : User, targetUser : User, nsp : Namespace){
		const srcSocket : Socket = this.usersSockets.get(srcUser.socketId);
		srcSocket.emit("denyNoti", targetUser);
	}

	//#############################################################
	// ##########           AFTER MATCH UP            #############
	//#############################################################

	async amIhost(client: Socket){
		const cur_game_id = await this.getCurGameRoomId(client);
		if (cur_game_id === null)
			return (-1);
		if (client.id === cur_game_id)
		return (0);
		return (1);
	}

	async other(client: Socket){
		const cur_game_id = await this.getCurGameRoomId(client);
		if (cur_game_id === null)
			return (-1);
		const cur_game = this.gameSessions.get(cur_game_id);
		if (client.id === cur_game.player1.nickname)
			return cur_game.player2.nickname;
		return cur_game.player1.nickname;
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


	async playerReady(client: Socket, nsp : Namespace){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game  = this.gameSessions.get(cur_game_id);
		if (!cur_game)
			return;
		let cur_player = (cur_game_id === client.id) ? cur_game.host : cur_game.guest;
		cur_player.playerStatus = PlayerStatus.Ready;
		(cur_game.readyNum)++;
		nsp.to(cur_game_id).emit("ready", { message: `Player ${cur_player.socketID} is ready` });
		this.logger.log("Ready! from " + cur_player.socketID);
		if (cur_game.readyNum == 2)
		{
			this.logger.log("game is good to go!");
			cur_game.gameStatus = GameStatus.AllReady;
			nsp.to(cur_game_id).emit("allReady");
		}
	}

	async playerUnready(client: Socket, nsp : Namespace){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
		if (!cur_game)
			return;
		let cur_player = cur_game_id === client.id ? cur_game.host : cur_game.guest;
		if (cur_game.readyNum == 2)
		{
			cur_game.gameStatus = GameStatus.Waiting;
		}
		if (cur_game.readyNum != 0)
		{
			cur_game.readyNum--;
		}
		cur_player.playerStatus = PlayerStatus.Waiting;
	}
	async socketGetter(socketId: string){
		const returnSocket : Socket = this.usersSockets.get(socketId);
		return (returnSocket);
	}

	async gameSetting(client: Socket, nsp: Namespace, game_info : any){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
		const host : Player2 = cur_game.host;
		const guest : Player2 = cur_game.guest;

		//update player, game status as playing
		cur_game.gameStatus = GameStatus.Playing;
		guest.playerStatus = PlayerStatus.Playing;
		host.playerStatus = PlayerStatus.Playing;
		console.log(game_info);
		//const guestSocket : Socket = await this.socketGetter(guest.socketID); 
		//const hostSocket : Socket = await this.socketGetter(host.socketID);
		const guestSocket : Socket = nsp.sockets.get(guest.socketID); 
		const hostSocket : Socket = nsp.sockets.get(host.socketID);  
		//flag as in game
		await this.updateUserStatusInGame(guestSocket);
		await this.updateUserStatusInGame(hostSocket);

		//nsp.to(cur_game_id).emit('gameStart');
		//set up game resources
		cur_game.ball.isEqual(game_info.ball);
		cur_game.board_x = game_info.board_x;

		cur_game.board_y = game_info.board_y;

		//set up pad resources
		for(let i = 0 ; i < 2; i++)
		{
			cur_game.pad.push(new PadItem(0,0,0,0,"0",0));
			cur_game.pad[i].isEqual(game_info.pad[i]);
		}
		//set up obstacles
		for(let i :number = 0 ; i <  game_info.obs.length; i++)
		{
			cur_game.obstacles.push(new Obstacle(0,0,0,0));
			cur_game.obstacles[i].isEqual(game_info.obs[i]);
		}

		console.log(cur_game.obstacles);
		console.log(cur_game.ball);
		console.log(cur_game.pad);
		//update ball direction.
		cur_game.updatedirection(cur_game.ball);
		console.log("setting");
		nsp.to(cur_game_id).emit("goodtogo", "");
	

		//draw game elements by 20ms
	}

	async gameWait(client: Socket, nsp: Namespace){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);


		nsp.to(cur_game_id).emit('gameSetting', { pad : cur_game.pad, ball : cur_game.ball, obs : cur_game.obstacles, board_x : cur_game.board_x, board_y: cur_game.board_y});
		//draw game elements by 20ms
		let count = 2;
		cur_game.count_intervalId = setInterval(()=>{
			nsp.to(cur_game_id).emit('count', count);
			count--;	
		},1000);
	}

	async gameStart(client: Socket, nsp: Namespace){
		console.log("start");
		
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game = this.gameSessions.get(cur_game_id);
		clearInterval(cur_game.count_intervalId);
		cur_game.intervalId = setInterval(() => {
			cur_game.pong(nsp);
			nsp.to(cur_game_id).emit('draw', cur_game.ball);
		}, 20);
	}

	
	//#############################################################
	// ##########          AFTER GAME START           #############
	//#############################################################
	
	async movePad1(client: Socket, pad_info : any, nsp: Namespace){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game : Game = this.gameSessions.get(cur_game_id);
		if (!cur_game)
			return;
		cur_game.pad[0].isEqual(pad_info);
		nsp.to(cur_game_id).emit("pad1", pad_info);
		// nsp.to(cur_game_id).emit("draw", cur_game.ball);
	}

	async movePad2(client: Socket, pad_info : any, nsp: Namespace){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game : Game = this.gameSessions.get(cur_game_id);
		if (!cur_game)
			return;
		cur_game.pad[1].isEqual(pad_info);
		nsp.to(cur_game_id).emit("pad2", pad_info);
		// nsp.to(cur_game_id).emit("draw", cur_game.ball);
	}
	
	async destroyGame(client: Socket){
		const cur_game_id = await this.getCurGameRoomId(client);
		const cur_game : Game = this.gameSessions.get(cur_game_id);
		if (!cur_game)
			return;
		let loserPlayer : Player1 | Player2;
		let winnerPlayer : Player1 | Player2;
		//aborting game
		if (cur_game.gameStatus === GameStatus.Playing){
			const outPlayer : Player1 | Player2 = 
				cur_game.player1.socketID === client.id ? cur_game.player1 : cur_game.player2;
			const remainPlayer : Player1 | Player2 = 
				cur_game.player2.socketID !== client.id ? cur_game.player1 : cur_game.player2;
			loserPlayer = outPlayer;
			winnerPlayer = remainPlayer;
		}
		else if (cur_game.player1.score > cur_game.player2.score)
		{
			winnerPlayer = cur_game.player1;
			loserPlayer = cur_game.player2;
		}
		else
		{
			winnerPlayer = cur_game.player2;
			loserPlayer = cur_game.player1;
		}
		cur_game.gameWinner = winnerPlayer;
		cur_game.gameLoser = loserPlayer;

		//disJoin room
		const guest : Player2 = cur_game.guest;
		const host : Player1  = cur_game.host;
		const guestSocket : Socket = this.usersSockets.get(guest.socketID); 
		const hostSocket : Socket = this.usersSockets.get(host.socketID);		
		//const guestSocket : Socket = this.usersSockets.get(guest.socketID); 
		//const hostSocket : Socket = this.usersSockets.get(host.socketID);

		//await this.updateUserStatusOnline(guestSocket);
		//await this.updateUserStatusOnline(hostSocket);

		//disjoin guest socket
		guestSocket.leave(cur_game_id);

		//this.logger.log("destoyed game : " + JSON.stringify(this.gameSessions.get(cur_game_id)));

		await this.recordGame(cur_game);
		//destory gameSession

	}


	async destroySession(client: Socket){
		//if in queue, pop out queue
		await this.popQueue(client);


		//if in game, destroy game
		await this.destroyGame(client);

	}


	//#############################################################
	//##########          MAKING GAME RECORD           ############
	//#############################################################
	createGame(): Promise<Games> {
		const newGame = this.gamesRepository.create();
		return this.gamesRepository.save(newGame);
	}

	createGamePlayer(gamePlayer: CreateGamePlayerDto): Promise<GamePlayer> {
		const newGamePlayer = this.gamePlayerRepository.create(gamePlayer);
		return this.gamePlayerRepository.save(newGamePlayer);
	}

	async recordGame(gameSession: Game){
		const cur_game : Game = gameSession;
		const loserPlayer = cur_game.gameLoser;
		const winnerPlayer = cur_game.gameWinner;

      this.createGame().then(async (game) => {
        const player1Dto: CreateGamePlayerDto = {
          user: await this.userRepository.findOneBy({
            id: gameSession.player1.userID,
          }),
          game: game,
          score: gameSession.player1.score,
          winner: gameSession.player1.score > gameSession.player2.score,
        };

        const player2Dto: CreateGamePlayerDto = {
          user: await this.userRepository.findOneBy({
            id: gameSession.player2.userID,
          }),
          game: game,
          score: gameSession.player2.score,
          winner: gameSession.player2.score > gameSession.player1.score,
        };

        await this.createGamePlayer(player1Dto);
        await this.createGamePlayer(player2Dto);
      });

	  	//update user DB
		await this.loserUpdate(loserPlayer);
		await this.winnerUpdate(winnerPlayer);

		this.gameSessions.delete(cur_game.gameID);
		
	}


	async winnerUpdate(winner : Player1 | Player2){
		const winner_user : User = await this.usersService.findUserBySocketId(winner.socketID);
		const wins_update: number = winner_user.wins + 1;
		const xp_update : number = winner_user.xp + 5;
		await this.usersService.update(winner_user.id, {wins : wins_update, xp: xp_update});
	}

	async loserUpdate(loser : Player1 | Player2){
		const loser_user : User = await this.usersService.findUserBySocketId(loser.socketID);
		const loses_update: number = loser_user.loses + 1;
		await this.usersService.update(loser_user.id, {loses : loses_update});
	}

}
