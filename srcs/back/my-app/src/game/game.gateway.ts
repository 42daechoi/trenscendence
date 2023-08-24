import { 
	Logger, 
	Inject,
	UseGuards,
	Req
} from '@nestjs/common';
import { 
	WebSocketServer,
	SubscribeMessage, 
	WebSocketGateway,
	MessageBody,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	WsResponse,
} from '@nestjs/websockets';
import { 
	Server,
	Namespace,
	Socket,
} from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/typeorm';
import { GameService } from './game.service';
import { JwtAuthGuard } from 'src/auth/guards/auth-jwt.guard';
import {CurrentUser} from 'src/users/decorators/current-user.decorator';
import {JwtService} from '@nestjs/jwt';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { WsJwtGuard } from './guards/ws.jwt.guard';
import {AuthService} from 'src/auth/auth.service';
import {CurrentUserWs} from './decorators/ws.current-user.decorator';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: ['http://localhost:3000'],
	credentials: true,
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(GameGateway.name);
	constructor(
		@Inject(UsersService)private usersService: UsersService,
		@Inject(AuthService)private authService: AuthService,
		@Inject(GameService) private gameService: GameService,
		@Inject(JwtService) private jwtService : JwtService,
	) {}
	//@WebSocketServer 데코레이터 부분을 주목해주세요.

	//현재 네임스페이스를 설정했기 때문에 @WebSocketServer 데코레이터가 반환하는 값은 서버 인스턴스가 아닌 네임스페이스 인스턴스입니다.

	//만약 네임스페이스를 설정하지 않았다면 @WebSocketServer 데코레이터가 반환하는 값은 서버 인스턴스가 되고, 그 때는 타입을 다음과 같이 서버 타입을 설정해줘야 합니다.
	//@WebSocketServer() server: Socket;
	@WebSocketServer() nsp: Namespace;
	@WebSocketServer() server: Server;

  	//execute right after init
	afterInit() {
		this.nsp.adapter.on('create-room', (room) => {
	  this.logger.log(`"Room:${room}" has been created.`);
    });

    this.nsp.adapter.on('join-room', (room, id) => {
      this.logger.log(`"Socket:${id}" has joined "Room:${room}".`);
    });

    this.nsp.adapter.on('leave-room', (room, id) => {
      this.logger.log(`"Socket:${id}" has left "Room:${room}".`);
	  this.gameService.destroysession(room);
    });

    this.nsp.adapter.on('delete-room', (roomName) => {
      this.logger.log(`"Room:${roomName}"is deleted.`);
    });

    this.logger.log('WebSocketServer init ✅');
	}
  	//execute right after connection
	@UseGuards(WsJwtGuard)
	async handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} socket connected`);
		//broadcast
		socket.emit('message', {
		  message: `${socket.id} has connected.`,
		});
		const jwtCookie = socket.handshake.headers.cookie?.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1];
		if (jwtCookie)
		{
			const user: User = await this.authService.verifyUser(jwtCookie);
			this.logger.log("found jwt in cookie : " + jwtCookie);
			//binding user and socket id
			if (!user)
				return ;
			this.logger.log("binding socket id with user id " + user.intraId);
			await this.usersService.update(user.id, {socketId: socket.id});
			await this.gameService.userComeNsp(socket);
			return Boolean(user);
		}
	}

	async handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} socket disconnected ❌`);
		const out_user = await this.usersService.findUserBySocketId(socket.id);
		if (!out_user)
			return;
		this.logger.log(JSON.stringify(socket.rooms));
		await this.gameService.popQueue(socket);
		await this.usersService.update(out_user.id, {socketId: null});
		await this.gameService.userOutNsp(socket);
	}

//	@UseGuards(WsJwtGuard)
	@SubscribeMessage('bindId')
	async bindId(
		@ConnectedSocket() socket: Socket,
		@MessageBody() userId: string) : Promise <WsResponse<unknown>> {
		this.logger.log("binding socket id : " + socket.id);
//		socket.emit('bindId', { socketId: socket.id, userId });
		await this.usersService.update(parseInt(userId), {socketId: socket.id});
		socket.emit('message', {
		  message: `${socket.id} has been binded with user ID.`,
		});
		return {event: 'bindId', data : {socketId: socket.id, userId} };
	}

	@SubscribeMessage('whoamiGateway')
	async idnetifyId(
		@ConnectedSocket() socket: Socket,
		@CurrentUserWs() userId : string) {
		this.logger.log("finding socket id : " + socket.id);
		this.logger.log("userId : " + userId);
		return (userId);
	}

	@SubscribeMessage('gameRoomCreate')
	async gameRoomCreate(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		socket.emit('gameRoomCreate', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}

	@SubscribeMessage('gameRoomIn')
	async gameRoomIn(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		socket.emit('gameRoomIn', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}

	@SubscribeMessage('match')
	async pushQueue(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		const clientSocket: Socket = socket;
		this.logger.log("event : match");
		await this.gameService.pushQueue(clientSocket);
		await this.gameService.monitorQueue(this.server);
		socket.emit('matching waiting', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}
//	@SubscribeMessage('allReady') async allReady(
//		@ConnectedSocket() socket: Socket) {
//		const user : User = await this.usersService.findUserBySocketId(socket.id);
//		const clientSocket: Socket = socket;
//
//		return { socketId: socket.id, userId: user.id };
//	}
//	
	@SubscribeMessage('matchQueueOut')
	async popQueue(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		const client: Socket = socket;
		await this.gameService.popQueue(client);
		socket.emit('matchQueueOut', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}

	@SubscribeMessage('testnsp')
	async testnsp(
		@ConnectedSocket() socket: Socket,
		@MessageBody() gameSetting: any 
	){
		this.gameService.testnsp(this.nsp, socket, gameSetting);
	}

	//#############################################################
	// ##########           AFTER MATCH UP            #############
	//#############################################################
	
	@SubscribeMessage('setUp')
	async setupRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() gameSetting: any ,
	) {
		this.gameService.echoRoomByGameHost(socket, this.server, gameSetting);
	}
	
	@SubscribeMessage('ready')
	async ready(
		@ConnectedSocket() socket: Socket) {
		await this.gameService.playerReady(socket, this.nsp);
	}

	@SubscribeMessage('unReady')
	async unready(
		@ConnectedSocket() socket: Socket) {
		await this.gameService.playerUnready(socket);
	}

	@SubscribeMessage('gameRoomOut')
	async gameRoomOut(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		//set user's status Online not InGame

		socket.emit('gameRoomOut', { socketId: socket.id, userId: user.id});
		await this.gameService.destroyGame(socket);
		return { socketId: socket.id, userId: user.id };
	}

	@SubscribeMessage('gameStart')
	async gameStart(
		@ConnectedSocket() socket: Socket, 

		@MessageBody()
		game_info
	) {
		await this.gameService.gameStart(socket, this.nsp, game_info);
	}


	//#############################################################
	// ##########          AFTER GAME START           #############
	//#############################################################

}
