import { WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    MessageBody,
    ConnectedSocket,
    OnGatewayInit
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { userDTO,
    channelDTO,
    chatDTO, 
    kickDTO, 
    joinDTO, 
    opDTO,
    roomDTO
    } from './dto/chat.dto';

  @WebSocketGateway({
    cors: {
      origin: "*",
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer() server: Server;
    private users: userDTO[] = [];
    private channels: channelDTO[] = [];

    //**********************************************************************//
    //****************************** init **********************************//
    //**********************************************************************//
    afterInit() {
      const channel  = {
          channelname: "$home",
          host: null,
          operator: [],
          users: [],
          state: "chat", //이 부분 포맷 정하기.
          member: 0,
          maxmember: 100,
          option: "public", //이 부분 포맷 정하기.
          password: null,
      }
      this.channels.push(channel);
    }

    //**********************************************************************//
    //**************************** connection ******************************//
    //**********************************************************************//
    async handleConnection(socket: Socket) {
      console.log('Client connected: ', socket.id);
      //connection은 그냥 체크하고만 넘어가기.
    }
  
    //**********************************************************************//
    //************************** disconnection *****************************//
    //**********************************************************************//
    async handleDisconnect(socket: Socket) {
      console.log('Client disconnected: ', socket.id);

      let user = this.users.find(u => u.socketid === socket.id);
      if (user) {
        const userIndex = this.users.indexOf(user);
        this.users.splice(userIndex, 1);

        if (user.channelname !== '$home')
        {
          let channel = this.channels.find(c => c.channelname === user.channelname);
          if (channel) {
            channel.users = this.users.filter(u => u.channelname === user.channelname).map(u => u.nickname);
            channel.member--;
            if (channel.member === 0)
            {
              const channelIndex = this.channels.indexOf(channel);
              this.channels.splice(channelIndex, 1);
            }
            if (channel.host === user.nickname)
            {
              //방장 위임.
              channel.host = channel.users[0];
              channel.channelname = channel.users[0]; // 방 이름까지 변경.
            }
          }
        }
        else
        {
          let channel = this.channels[0];
          channel.users = this.users.filter(u => u.channelname === user.channelname).map(u => u.nickname);
          if (channel.member >= 1) channel.member--;
        }
      }
    }
  
    //*********************************************************************//
    //***************************  bind  **********************************//
    //*********************************************************************//
    @SubscribeMessage('bind')
    handlebind(@MessageBody() username: string, @ConnectedSocket() socket: Socket) : void {
      console.log('UserNickname: ', username, ' SocketId: ', socket.id);

      const user: userDTO = {
        socketid: socket.id,
        nickname: username,
        channelname: '$home',
        socket: socket
      };

      this.users.push(user);
      this.channels[0].users.push(user.nickname);
      this.channels[0].member++;
      socket.join(user.channelname);
    }

    //*********************************************************************//
    //****************************  chat   ********************************//
    //*********************************************************************//
    @SubscribeMessage('chat')
    handlechat(@MessageBody() msgobj: chatDTO, @ConnectedSocket() socket: Socket) {
      console.log('UserNickname: ', msgobj.nickname, ' Target: ', msgobj.target, ' Flag: ', msgobj.flag, ' Msg: ', msgobj.msg);
      const user = this.users.find(u => u.socketid === socket.id);
      if (!user) return;
      if (msgobj.flag == "broad")
      {
        //* 유저가 속한 채널에 채팅. 
        console.log("channel chat part");
        socket.broadcast.to(user.channelname).emit('chat', msgobj);
        //socket.to(user.channelname).emit('chat', msgobj); 본인 소켓 포함. 위는 본인 소켓 제외.
      }
      else
      {
        //* 귓속말
        console.log("dm part");
        const target = this.users.find(u => u.nickname === msgobj.target)
        console.log("target check :", target);
        if (target)
        {
          //유저 한명에게 dm보내기. 
          socket.to(target.socketid).emit('chat', msgobj);
        }
      }
    }

    //*********************************************************************//
    //****************************  where  ********************************//
    //*********************************************************************//
    @SubscribeMessage('where')
    handlewhere(@MessageBody() nickname: string, @ConnectedSocket() socket: Socket) {
      console.log('user: ', nickname);
      //이후 유저 어디서 체크 & 유저가 있는 위치 확인 후 리플라이 전달.

      let user = this.users.find(u => u.socketid === socket.id)
      if (!user) return;
      if (user.nickname !== nickname)
      {
        console.log('bind failure');
        return;
      }
      
      let channel = this.channels.find(c => c.channelname === user.channelname);
      console.log(JSON.stringify(channel, null, 2));
      socket.emit('where', channel);
    }

    //*********************************************************************//
    //***************************  create  ********************************//
    //*********************************************************************//
    @SubscribeMessage('create')
    handlecreate(@MessageBody() room: roomDTO, @ConnectedSocket() socket: Socket) {

      // 유저 확인
      let user = this.users.find(u => u.socketid === socket.id)
      if (!user) return;

      // 이미 자신이 만든 방에 있을 경우. create 불가.
      // 이밖에 중복확인 할 필요없음. 방 이름은 곧 호스트 이름이라서.
      if (user.channelname === room.nickname) return;

      // 채널 생성
      const newChannel = {
        channelname: room.nickname,
        host: room.nickname,
        operator: [],
        users: [user.nickname],
        state: "chat",
        member: 1,
        maxmember: room.maxmember,
        option: room.option,
        password: room.password,
      };

      if (newChannel.option === "public")
      {
        newChannel.password = null;
      }
      this.channels.push(newChannel);

      // 이전 채널 정보 업데이트
      let beforeChannel = this.channels.find(c => c.channelname === user.channelname);
      if (beforeChannel) {
        beforeChannel.member--;
        const removeIdx = beforeChannel.users.indexOf(user.nickname);
        if (removeIdx !== -1) {
            beforeChannel.users.splice(removeIdx, 1);
        }
      }
      
      // 유저 정보 업데이트 및 소켓 조인
      socket.leave(user.channelname);
      user.channelname = room.nickname;
      socket.join(room.nickname);
      
      socket.emit('create', newChannel);
    }

    //*********************************************************************//
    //***************************  modify  ********************************//
    //*********************************************************************//
    @SubscribeMessage('modify')
    handlemodify(@MessageBody() room: roomDTO, @ConnectedSocket() socket: Socket) {
      
      // 유저 확인
      let user = this.users.find(u => u.socketid === socket.id)
      if (!user) return;
      const channel = this.channels.find(c => c.channelname === user.channelname);
      if (!channel) return;
      if ( user.channelname !== user.nickname)
      {
        if (!channel.operator.includes(user.nickname)) return;
      }

      console.log("before modify---------------------");
      console.log((channel));
      // user가 host 혹은 operator 라면.
      let modifyingChannel = this.channels.find(c => c.channelname === user.channelname);
      modifyingChannel.maxmember = room.maxmember;
      modifyingChannel.option = room.option;
      if (modifyingChannel.option === "private" || modifyingChannel.option === "protected")
      {
        modifyingChannel.password = room.password;
      }
      if (modifyingChannel.option === "public")
      {
        modifyingChannel.password = null;
      }
      
      console.log("after modify---------------------");
      console.log((modifyingChannel));

      const modifiedChannel = {
        ...modifyingChannel, // 모든 속성 복사
        option: modifyingChannel.option, // option 속성 복사
        maxmember: modifyingChannel.maxmember, // maxmember 속성 복사
        password: modifyingChannel.password, // password 속성 복사
      };
      socket.emit('modify', modifiedChannel);
    }
    
    //*********************************************************************//
    //****************************  join   ********************************//
    //*********************************************************************//
    @SubscribeMessage('join')
    handlejoin(@MessageBody() joinobj: joinDTO, @ConnectedSocket() socket: Socket) {
    console.log('nickname: ', joinobj.nickname, ' channelname: ', joinobj.channelname, ' password: ', joinobj.password);

    // 유저 확인
    let user = this.users.find(u => u.socketid === socket.id)
    if (!user) return;

    // 이미 해당 채널일 경우 
    if (user.channelname === joinobj.channelname) return;

    // 방 없으면 못 들감
    if (!this.channels.some(c => c.channelname === joinobj.channelname)) {
      console.log("no room");
      return;
    }

    // 채널 체크
    let channel = this.channels.find(c => c.channelname === joinobj.channelname)
    if (!channel) return;

    if (channel.option === "private")
    {
      socket.emit('join', { flag: false, list: null });
      return;
    }

    // 방 비번 확인
    if (channel.option === "protected")
    {
      if (channel.password !== joinobj.password)
      {
        console.log("wrong password");
        return;
      }
    }

    // 방 입장.
    if (channel.maxmember - channel.member >= 1) {
      channel.users.push(user.nickname);
      // 이전 채널 정보 업데이트
      let beforeChannel = this.channels.find(c => c.channelname === user.channelname);
      if (beforeChannel) {
        beforeChannel.member--;
        const removeIdx = beforeChannel.users.indexOf(user.nickname);
        if (removeIdx !== -1) {
          beforeChannel.users.splice(removeIdx, 1);
        }
        
        //이전에 유저가 operator일 경우
        if (beforeChannel.operator.includes(user.nickname))
        {
          const targetIdx = beforeChannel.operator.indexOf(user.nickname);
          if (targetIdx !== -1) beforeChannel.operator.splice(targetIdx, 1);
        }

        //이전에 유저가 host일 경우
        if (beforeChannel.channelname === user.nickname)
        {  
          beforeChannel.host = beforeChannel.users[0];
          beforeChannel.channelname = beforeChannel.users[0]; // 방 이름까지 변경.
        }
      }

      // 유저 정보 업데이트 및 소켓 조인
      socket.leave(user.channelname);
      user.channelname = joinobj.channelname;
      socket.join(joinobj.channelname);
      
      channel.member++;
      socket.emit('join', { flag: true, list: channel.users });
      }
      else {
        console.log("maxmember over");
        socket.emit('join', { flag: false, list: null });
      }
    }

    //*********************************************************************//
    //*****************************  op  **********************************//
    //*********************************************************************//
    @SubscribeMessage('op')
    handleop(@MessageBody() op: opDTO, @ConnectedSocket() socket: Socket) {
      console.log('nickname: ', op.nickname, ' target: ', op.target);
      
      let user = this.users.find(u => u.socketid === socket.id)
      if (!user) return;
      if (user.nickname !== op.nickname) return;
      if (user.nickname !== user.channelname) return;

      const channel = this.channels.find(c => c.channelname === user.channelname);
      if (!channel) return;
      if (!channel.users.includes(op.target)) return;

      channel.operator.push(op.target);
      socket.emit('op', true);
    }

    //*********************************************************************//
    //****************************  kick   ********************************//
    //*********************************************************************//
    @SubscribeMessage('kick')
    handlekick(@MessageBody() kickobj: kickDTO, @ConnectedSocket() socket: Socket) {
      console.log('usernickname: ', kickobj.nickname, ' target: ', kickobj.target);
      
      let user = this.users.find(u => u.socketid === socket.id);
      if (!user) return;
      if (user.nickname !== kickobj.nickname) return;
             
      // 타겟이 존재하는지.
      let target = this.users.find(u => u.nickname === kickobj.target);
      if (!target) 
      {
        socket.emit("kick", false);
        return;
      }

      // 타켓이 본인인지.
      if (user.nickname === kickobj.target) 
      {
        socket.emit("kick", false);
        return;
      } 

      // 추방 대상이 현재 채널에 존재하는지 확인.
      let targetChannel = this.channels.find(c => c.channelname === user.channelname);
      if (!targetChannel || !targetChannel.users.includes(kickobj.target))
      {
        socket.emit("kick", false);
        return;
      } 

      // target이 호스트일 경우 그냥 파.
      if (target.nickname === user.channelname)
      {
        socket.emit("kick", false);
        return;
      } 

      //유저가 호스트 또는 오퍼레이터일 경우.
      if (user.channelname === user.nickname || targetChannel.operator.includes(user.nickname)) {

      // 추방 대상을 해당 채널에서 제거
      const targetIndex = targetChannel.users.indexOf(kickobj.target);
      if (targetIndex !== -1) 
      {
        targetChannel.users.splice(targetIndex, 1);
        targetChannel.member--;
        
        //만약 타겟이 오퍼레이터였을 경우.
        if (targetChannel.operator.includes(kickobj.target))
        {
          const targetIndex2 = targetChannel.operator.indexOf(kickobj.target);
          if (targetIndex2 !== -1) targetChannel.operator.splice(targetIndex2, 1);
        }

        target.socket.leave(target.channelname);
        target.channelname = '$home'; // 추방된 사용자는 home 채널로 이동
        target.socket.join(target.channelname);
        //target.socket.emit('kicked', {}); // 추방된 사용자에게 kicked 이벤트 전송
        socket.broadcast.to(user.channelname).emit('chat', {
          nickname: 'System',
          target: target.nickname,
          flag: "broad",
          msg: `${kickobj.target} has been kicked.`,
        });

        let home = this.channels.find(c => c.channelname === target.channelname);
        home.member++;
        home.users.push(target.nickname);
        socket.emit("kick", true);
      }
      else {
       socket.emit("kick", false);
      }
    }
   }
  
    //*********************************************************************//
    //****************************  home   ********************************//
    //*********************************************************************//
    @SubscribeMessage('home')
    handlehome(@MessageBody() nickname: string, @ConnectedSocket() socket: Socket) {

      let user = this.users.find(u => u.socketid === socket.id);
      if (!user) return;
      if (user.channelname === '$home') return;
    
      let channel = this.channels.find(c => c.channelname === user.channelname);
      if (!channel) return;

      if (channel) {
        const removeIdx = channel.users.indexOf(nickname);
        if (removeIdx !== -1) {
          channel.users.splice(removeIdx, 1);
        }
      }
      channel.member--;
      if (channel.operator.includes(user.nickname)) //오퍼레이터였을 경우
      {
        const idx = channel.operator.indexOf(user.nickname);
        if (idx !== -1) channel.operator.splice(idx, 1);
      }
      if (channel.member === 0)
      {  
        const channelIndex = this.channels.indexOf(channel);
         this.channels.splice(channelIndex, 1);
      }
      if (channel.host === user.nickname) //방장일 경우
      {
        //방장 위임.
        channel.users = this.users.filter(u => u.channelname === user.channelname).map(u => u.nickname);
        channel.host = channel.users[0];
        channel.channelname = channel.users[0]; // 방 이름까지 변경.
      }

      socket.leave(user.channelname);
      user.channelname = "$home";
      socket.join("$home");
      
      let home = this.channels.find(c => c.channelname === user.channelname);
      home.member++;
      home.users.push(user.nickname);
      
      socket.emit("home", home);
    }
}