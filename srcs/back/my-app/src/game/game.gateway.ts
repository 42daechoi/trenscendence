import { 
	Logger, 
	Inject } from '@nestjs/common';
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
	Socket 
} from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/typeorm';
import { GameService } from './game.service';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(GameGateway.name);
	constructor(
		@Inject(UsersService)private usersService: UsersService,
		@Inject(GameService) private gameService: GameService) {}
	//@WebSocketServer 데코레이터 부분을 주목해주세요.

	//현재 네임스페이스를 설정했기 때문에 @WebSocketServer 데코레이터가 반환하는 값은 서버 인스턴스가 아닌 네임스페이스 인스턴스입니다.

	//만약 네임스페이스를 설정하지 않았다면 @WebSocketServer 데코레이터가 반환하는 값은 서버 인스턴스가 되고, 그 때는 타입을 다음과 같이 서버 타입을 설정해줘야 합니다.
	//@WebSocketServer() server: Socket;
	@WebSocketServer() nsp: Namespace;
	@WebSocketServer() server: Server;

  	//execute right after init
	afterInit() {
		this.nsp.adapter.on('create-room', (room) => {
	  this.logger.log(`"Room:${room}"이 생성되었습니다.`);
    });

    this.nsp.adapter.on('join-room', (room, id) => {
      this.logger.log(`"Socket:${id}"이 "Room:${room}"에 참여하였습니다.`);
    });

    this.nsp.adapter.on('leave-room', (room, id) => {
      this.logger.log(`"Socket:${id}"이 "Room:${room}"에서 나갔습니다.`);
    });

    this.nsp.adapter.on('delete-room', (roomName) => {
      this.logger.log(`"Room:${roomName}"이 삭제되었습니다.`);
    });

    this.logger.log('WebSocketServer init ✅');
	}
  
  	//execute right after connection
	handleConnection(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} socket connected`);

		//broadcast
		socket.emit('message', {
		  message: `${socket.id} has connected.`,
		});

		//how about to emit an event to one socket?
	}

	async handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.logger.log(`${socket.id} socket disconnected ❌`);
		const out_user = await this.usersService.findUserBySocketId(socket.id);
		if (!out_user)
			return;
		await this.usersService.update(out_user.id, {socketId: null});
	}

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
		@ConnectedSocket() socket: Socket) {
		this.logger.log("finding socket id : " + socket.id);
		const user : User = await this.usersService.findUserBySocketId(socket.id);
//		socket.emit('whoamiGateway', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, user};
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

	@SubscribeMessage('gameRoomOut')
	async gameRoomOut(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		socket.emit('gameRoomOut', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}

	@SubscribeMessage('gameStart')
	async gameStart(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		socket.emit('gameStart', { socketId: socket.id, userId: user.id});
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

	@SubscribeMessage('ready')
	async ready(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		const clientSocket: Socket = socket;
		socket.emit('ready, game start waiting', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}

	@SubscribeMessage('allReady')
	async allReady(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		const clientSocket: Socket = socket;
		await this.gameService.pushQueue(clientSocket);
		await this.gameService.monitorQueue(this.server);

		socket.emit('gameStart', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}
	
	@SubscribeMessage('matchQueueOut')
	async popQueue(
		@ConnectedSocket() socket: Socket) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		const client: Socket = socket;
		await this.gameService.popQueue(client);
		socket.emit('matchQueueOut', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}

	@SubscribeMessage('setUp')
	async setupRoom(
		@ConnectedSocket() socket: Socket,
		@MessageBody() gameSetting: any 
	) {
		const user : User = await this.usersService.findUserBySocketId(socket.id);
		const client: Socket = socket;
		await this.gameService.popQueue(client);
		socket.emit('setUp', { socketId: socket.id, userId: user.id});
		return { socketId: socket.id, userId: user.id };
	}

}
