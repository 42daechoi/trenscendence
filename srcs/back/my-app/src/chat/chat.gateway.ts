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
    roomDTO,
    } from './dto/chat.dto';
import { UsersService } from 'src/users/users.service';
import { Inject } from '@nestjs/common';
import { User } from 'src/typeorm';
import { use } from 'passport';
import { channel } from 'diagnostics_channel';

  @WebSocketGateway({
    cors: {
      origin: "*",
    },
  })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    constructor(
      @Inject(UsersService) private readonly usersService,
    ){}
    @WebSocketServer() server: Server;
    private users: userDTO[] = [];
    private channels: channelDTO[] = [];
    public channelnames: string[] = [];

    //**********************************************************************//
    //****************************** init **********************************//
    //**********************************************************************//
    afterInit() {
      console.log('----------------------------------------');
      console.log('-------------------ININT----------------');  
      console.log('----------------------------------------');

      const channel  = {
          channelname: "$home",
          host: null,
          operator: [],
          users: [],
          member: 0,
          maxmember: 420,
          option: "public",
          password: null,
      }
      this.channels.push(channel);
      this.channelnames.push(channel.channelname);
    }


    //**********************************************************************//
    //**************************** connection ******************************//
    //**********************************************************************//
    async handleConnection(socket: Socket) {
      //connection은 그냥 체크.
      console.log('----------------------------------------');
      console.log('----------------CONNECTION--------------');  
      console.log('Client connected: ', socket.id);
      console.log('----------------------------------------');
    }
  

    //**********************************************************************//
    //************************** disconnection *****************************//
    //**********************************************************************//
    async handleDisconnect(socket: Socket) {
      console.log('----------------------------------------');
      console.log('--------------DICONNECTION--------------');  
      console.log('Client connected: ', socket.id);
      console.log('----------------------------------------');


      let user = this.users.find(u => u.socketid === socket.id);
      if (user) {
        //users에서 지우기.
        const userIndex = this.users.indexOf(user);
        this.users.splice(userIndex, 1);

        if (user.channelname !== '$home')
        {
          let channel = this.channels.find(c => c.channelname === user.channelname);
          if (channel) {
            channel.member--;
            if (channel.member === 0)
            {
              channel = null; //마지막 인원이었을 경우 객체 삭제.
            }
            else
            {
              //일반 유저목록에서 삭제
              const removeIdx = channel.users.indexOf(user.id);
              if (removeIdx !== -1) 
              {
                channel.users.splice(removeIdx, 1);
              }
              //만약 오퍼레이터였을 때
              if (channel.operator.includes(user.id))
              {
                const removeIdx = channel.operator.indexOf(user.id);
                if (removeIdx !== -1) {
                  channel.operator.splice(removeIdx, 1);
                }
              }
              //만약 호스트였을 때
              if (channel.host === user.id)
              {
                //방장 위임.
                channel.host = channel.users[0];
                let newhost = this.users.find(u => u.id === channel.users[0])
                const newhost_user : User = this.usersService.findUserById(newhost.id);
                channel.channelname = newhost_user.nickname; // 방 이름 변경.
              }
              socket.broadcast.to(channel.channelname).emit('update', false);   //퇴장 메시지
            }
          }
        }
        else
        {
            let home = this.channels[0];
            home.member--;
            const removeIdx = home.users.indexOf(user.id);
            if (removeIdx !== -1) {
                home.users.splice(removeIdx, 1);
            }
            socket.broadcast.to(home.channelname).emit('update', false);        //퇴장 메시지
        }
        
        //마지막 user 객체 지우기
        user = null;
      }
    }

  
    //*********************************************************************//
    //***************************  bind  **********************************//
    //*********************************************************************//
    @SubscribeMessage('bind')
    async handlebind(@MessageBody() id: number, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('-----------------BIND-------------------');
      console.log('Userid: ', id);
      console.log('SocketId: ', socket.id);
      console.log('----------------------------------------');

      const block_users : User[] = await this.usersService.getUserBlocks(id);
      let   block_list : Map<number, string>;

      for (const blockuser of block_users) {
        block_list.set(blockuser.id, blockuser.nickname);
      }

      const user: userDTO = {
        socketid: socket.id,
        id: id,
        channelname: '$home',
        socket: socket,
        blocklist: block_list
      };

      this.users.push(user);
      this.channels[0].users.push(user.id);
      this.channels[0].member++;
      socket.join(user.channelname);
      socket.broadcast.to(user.channelname).emit('update', true); //$home 채널 입장 시 정보 업데이트
    }


    //*********************************************************************//
    //****************************  chat   ********************************//
    //*********************************************************************//
    @SubscribeMessage('chat')
    handlechat(@MessageBody() chatobj: chatDTO, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('-----------------CHAT-------------------');
      console.log('UserId: ', chatobj.id, ' Target: ', chatobj.target, ' Flag: ', chatobj.flag, ' Msg: ', chatobj.msg);
      console.log('----------------------------------------');

      const user = this.users.find(u => u.id === chatobj.id);
      if (!user) return;
      if (chatobj.flag == "broad")
      {
        //* 유저가 속한 채널에 채팅.
        // ------> 여기서 block을 어떻게 할지. block 체크 후 각각 dm처럼 보내줄 수는 있으나..
        console.log('----------------------------------------');
        console.log("             broad chat part            ");
        console.log('----------------------------------------');
        console.log(user.channelname);
        socket.broadcast.to(user.channelname).emit('chat', chatobj);
      }
      else
      {
        //* 귓속말
        console.log('----------------------------------------');
        console.log("             dm chat part               ");
        console.log('----------------------------------------');

        const target = this.users.find(u => u.id === chatobj.target);

        const blocks = target.blocklist;
        const block_check = blocks.get(user.id);

        console.log('----------------------------------------');
        console.log(blocks)
        //console.log('target check :', target);
        console.log('----------------------------------------');


        if (block_check === undefined)
        {
          if (target && target.id !== user.id)
          {
            //유저 한명에게 dm보내기. 
            socket.to(target.socketid).emit('chat', chatobj);
          }
        }
        else
        {
         console.log('----------------------------------------');
         console.log('                  blocked               ');
         console.log('----------------------------------------');
         return;
        }
      }
    }


    //*********************************************************************//
    //****************************  where  ********************************//
    //*********************************************************************//
    @SubscribeMessage('where')
    handlewhere(@MessageBody() userid: number, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('-----------------WHERE------------------');
      console.log('userid: ', userid);
      console.log('----------------------------------------');

      //이후 유저 어디서 체크 & 유저가 있는 위치 확인 후 리플라이 전달.
      let user = this.users.find(u => u.id === userid);
      if (!user) return;      
      let channel = this.channels.find(c => c.channelname === user.channelname);
      console.log('----------------------------------------');
      console.log('-----------------WHERE------------------');     
      console.log(JSON.stringify(channel, null, 2));
      console.log('----------------------------------------');
      socket.emit('where', channel);
    }


    //*********************************************************************//
    //***************************  create  ********************************//
    //*********************************************************************//
    @SubscribeMessage('create')
    async handlecreate(@MessageBody() room: roomDTO, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('-----------------CREATE-----------------');  
      console.log(room);
      console.log('----------------------------------------');

      // 유저 확인
      let user = this.users.find(u => u.id === room.id)
      if (!user) 
      {
        console.log('----------------------------------------');
        console.log('            can not find user           ');
        console.log('----------------------------------------'); 
        return;
      }
      // 이미 다른 방의 호스트일 경우 방 생성 불가.(왜냐면 방 이름이 곧 닉네임이기에)
      let checkChannel = this.channels.find(c => c.channelname === user.channelname);
      if (checkChannel.host === user.id)
      {
        console.log('----------------------------------------');
        console.log('              already host              ');
        console.log('----------------------------------------'); 
        return;
      }

      const user_info : User = await this.usersService.findUserById(user.id);
      console.log('----------------------------------------');
      console.log(user_info.nickname)
      console.log('----------------------------------------'); 

      // 채널 생성
      const newChannel = {
        channelname: user_info.nickname,
        host: room.id,
        operator: [],
        users: [user.id],
        member: 1,
        maxmember: room.maxmember,
        option: room.option,
        password: room.password,
      };

      if (newChannel.option === "public" || newChannel.option === "private")
      {
        newChannel.password = null;
      }
      this.channels.push(newChannel);
      this.channelnames.push(newChannel.channelname);

      // 이전 채널 객체 정보 업데이트
      let beforeChannel = this.channels.find(c => c.channelname === user.channelname);
      if (beforeChannel) {
        beforeChannel.member--;
        if (beforeChannel.member === 0)
        {
          if (beforeChannel.channelname !== '$home')
          {
            //channels에서 삭제
            const removeChannelIdx = this.channels.findIndex(c => c.channelname === beforeChannel.channelname);
            if (removeChannelIdx !== -1) {
              this.channels.splice(removeChannelIdx, 1);
            }
            //channelnames에서 삭제
            const removeChannelnameIdx = this.channelnames.findIndex(c => c === beforeChannel.channelname);
            if (removeChannelnameIdx !== -1) {
              this.channelnames.splice(removeChannelnameIdx, 1);
            }
          }

          socket.leave(user.channelname);
          user.channelname = newChannel.channelname;
          socket.join(user.channelname);

          //channel 객체 삭제
          beforeChannel = null;

          socket.emit('create', { flag: true, list: newChannel.users });
          socket.broadcast.to('$home').emit('update', false);         //퇴장 메시지
          socket.broadcast.to(user.channelname).emit('update', true); //입장 메시지

        }
        else
        {
          //users 목록에서 유저 삭제
          const removeIdx = beforeChannel.users.indexOf(user.id);
          if (removeIdx !== -1) {
            beforeChannel.users.splice(removeIdx, 1);
          }
          
          //유저가 operator였을 경우
          if (beforeChannel.operator.includes(user.id))
          {
            const removeIdx = beforeChannel.operator.indexOf(user.id);
            if (removeIdx !== -1) beforeChannel.operator.splice(removeIdx, 1);
          }

          socket.leave(user.channelname);
          user.channelname = user_info.nickname;
          socket.join(user.channelname);

          socket.emit('create', newChannel);
          socket.broadcast.to(beforeChannel.channelname).emit('update', false);   //퇴장 메시지
          socket.broadcast.to(user.channelname).emit('update', true);             //입장 메시지
        }
      }
    }

    
    //*********************************************************************//
    //***************************  modify  ********************************//
    //*********************************************************************//
    @SubscribeMessage('modify')
    handlemodify(@MessageBody() room: roomDTO, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('-----------------MODIFY-----------------');  
      console.log(room);
      console.log('----------------------------------------');
      
      let user = this.users.find(u => u.id === room.id)
      if (!user) return;
      let modifyingchannel = this.channels.find(c => c.channelname === user.channelname);
      if (!modifyingchannel) return;

      //예외처리, 채널이 홈이거나 유저가 호스트나 오퍼레이터가 아닐 경우 
      if (modifyingchannel.host !== user.id || modifyingchannel.channelname === "$home")
      {
        if (!modifyingchannel.operator.includes(user.id)) return;
      }

      console.log('----------------------------------------');
      console.log('                 BEFORE                 ');
      console.log((modifyingchannel));
      console.log('----------------------------------------');

      modifyingchannel.maxmember = room.maxmember;
      modifyingchannel.option = room.option;
      if (modifyingchannel.option === "protected")
      {
        modifyingchannel.password = room.password;
      }
      else
      {
        modifyingchannel.password = null;
      }
      
      console.log('----------------------------------------');
      console.log('                 AFTER                  ');
      console.log((modifyingchannel));
      console.log('----------------------------------------');

      socket.emit('modify', modifyingchannel);
    }
    

    //*********************************************************************//
    //****************************  join   ********************************//
    //*********************************************************************//
    @SubscribeMessage('join')
    handlejoin(@MessageBody() joinobj: joinDTO, @ConnectedSocket() socket: Socket) {
      
      console.log('----------------------------------------');
      console.log('-----------------JOIN-------------------');     
      console.log('userid: ', joinobj.id, ' channelname: ', joinobj.channelname, ' password: ', joinobj.password);
      console.log('----------------------------------------');
      
      // 유저 확인
      let user = this.users.find(u => u.id === joinobj.id)
      if (!user) return;

      // 해당 채널이 없거나, 이미 해당 채널일 경우 못들어감.
      const channel = this.channels.find(c => c.channelname === joinobj.channelname);
      if (!channel)
      {
        console.log('----------------------------------------');
        console.log('                no room                 ');
        console.log('----------------------------------------'); 
        return;
      }
      if (channel.channelname === user.channelname)
      {
        console.log('----------------------------------------');
        console.log('           already in room              ');
        console.log('----------------------------------------'); 
        return;
      }

      //만약 유저가 현재 방의 호스트일 경우, 현재 방을 나간 후 join 해야 됨.
      if (channel.host === user.id)
      {
        console.log('----------------------------------------');
        console.log('            you are host                ');
        console.log('----------------------------------------'); 
        return;
      }

      // 채널 옵션 확인
      if (channel.option === "private")
      {
        socket.emit('join', { flag: false, list: null });
        return;
      }
      else if (channel.option === "protected")
      {
        if (channel.password !== joinobj.password)
        {
          console.log('----------------------------------------');
          console.log('           wrong password               ');
          console.log('----------------------------------------'); 
          return;
        }
      }

      // 방 입장.
      if (channel.maxmember - channel.member >= 1) {
        channel.users.push(user.id);

        // 이전 채널 정보 업데이트
        let beforeChannel = this.channels.find(c => c.channelname === user.channelname);
        if (beforeChannel) {
          beforeChannel.member--;

          if (beforeChannel.member === 0)
          {
            if (beforeChannel.channelname !== '$home')
            {
              //channels에서 삭제
              const removeChannelIdx = this.channels.findIndex(c => c.channelname === beforeChannel.channelname);
              if (removeChannelIdx !== -1) {
                this.channels.splice(removeChannelIdx, 1);
              }
              //channelnames에서 삭제
              const removeChannelnameIdx = this.channelnames.findIndex(c => c === beforeChannel.channelname);
              if (removeChannelnameIdx !== -1) {
                this.channelnames.splice(removeChannelnameIdx, 1);
              }
            }

            socket.leave(user.channelname);
            user.channelname = joinobj.channelname;
            socket.join(channel.channelname);
            
            //이전 channel 객체 삭제
            beforeChannel = null;

            channel.member++;              //이동한 채널 명수 늘리기.
            channel.users.push(user.id);   //이동한 채널 유저 목록에 추가.
            socket.emit('join', { flag: true, list: channel.users });

            if (beforeChannel.channelname === '$home')
            {
              socket.broadcast.to('$home').emit('update', false);   //퇴장 메시지
            }
            socket.broadcast.to(user.channelname).emit('update', true); //이 부분 메시지로 바꿀지 생각.

          }
          else
          {
            const removeIdx = beforeChannel.users.indexOf(user.id);
            if (removeIdx !== -1) {
              beforeChannel.users.splice(removeIdx, 1);
            }
            
            //이전 채널에서 유저가 operator였을 경우
            if (beforeChannel.operator.includes(user.id))
            {
              const removeIdx = beforeChannel.operator.indexOf(user.id);
              if (removeIdx !== -1) beforeChannel.operator.splice(removeIdx, 1);
            }

            socket.leave(user.channelname);
            user.channelname = joinobj.channelname;
            socket.join(channel.channelname);

            channel.member++;             //이동한 채널 명수 늘리기.
            channel.users.push(user.id);  //이동한 채널 유저 목록에 추가.
            socket.emit('join', { flag: true, list: channel.users });

            socket.broadcast.to(beforeChannel.channelname).emit('update', false);   //퇴장 메시지
            socket.broadcast.to(user.channelname).emit('update', true);             //입장 메시지
          }
        }
      }
      else {
        console.log('----------------------------------------');
        console.log('           room is fulled               ');
        console.log('----------------------------------------'); 
        socket.emit('join', { flag: false, list: null });
      }
    }

  
    //*********************************************************************//
    //*****************************  op  **********************************//
    //*********************************************************************//
    @SubscribeMessage('op')
    handleop(@MessageBody() op: opDTO, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('----------------- OP -------------------');  
      console.log('userId: ', op.id, ' targetId: ', op.target);
      console.log('----------------------------------------');
      
      let user = this.users.find(u => u.id === op.id)
      if (!user) return;

      // 호스트와 op 인지 체크.
      // 호스트 & operator가 op 권한 줄 수 있도록.
      let channel = this.channels.find(c => c.channelname === user.channelname);
      if (!channel) return;
      if (channel.host !== user.id)
      {
        if (!channel.operator.includes(op.target))
        {
          console.log('----------------------------------------');
          console.log('                 no access              ');
          console.log('----------------------------------------'); 
          return;
        }
      }

      //타겟이 해당채널에 존재하는지 체크
      if (!channel.users.includes(op.target)) 
      {
        console.log('----------------------------------------');
        console.log('                 no target              ');
        console.log('----------------------------------------'); 
        return;
      }

      //이미 오퍼레이터인지 체크
      if (channel.operator.includes(op.target))
      {
        console.log('----------------------------------------');
        console.log('           target is already op         ');
        console.log('----------------------------------------'); 
        return;
      }

      //타겟이 host인지 체크
      if (channel.host === op.target)
      {
        console.log('----------------------------------------');
        console.log('             target is host             ');
        console.log('----------------------------------------'); 
        return;
      }

      channel.operator.push(op.target);
      socket.emit('op', true);
    }


    //*********************************************************************//
    //************************  allchannel   ******************************//
    //*********************************************************************//
    @SubscribeMessage('allchannel')
    handleallchannel(@ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('--------------ALLCHANNEL----------------');  
      console.log('----------------------------------------');
      
      socket.emit('allchannel', this.channelnames);
    }


    //*********************************************************************//
    //****************************  kick   ********************************//
    //*********************************************************************//
    @SubscribeMessage('kick')
    handlekick(@MessageBody() kickobj: kickDTO, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('-----------------KICK-------------------');  
      console.log('userId: ', kickobj.id, ' targetId: ', kickobj.target);
      console.log('----------------------------------------');

      
      let user = this.users.find(u => u.id === kickobj.id);
      if (!user) return;

      let channel = this.channels.find(c => c.channelname === user.channelname);
      if (!channel) return;

      // 유저가 호스트 혹은 오퍼레이터가 아닐 경우
      if (channel.host !== user.id)
      {
        if (!channel.operator.includes(user.id))
        {
          console.log('----------------------------------------');
          console.log('                 no access              ');
          console.log('----------------------------------------'); 
          socket.emit("kick", false);
          return;
        }
      }
             
      // 타겟이 존재하는지, 추방 대상이 현재 채널에 존재하는지.
      let target = this.users.find(u => u.id === kickobj.target);
      if (!target) return;
      if (user.channelname !== target.channelname)
      {
        console.log('----------------------------------------');
        console.log('                 no target              ');
        console.log('----------------------------------------'); 
        socket.emit("kick", false);
        return;
      }

      // 타켓이 본인인지.
      if (user.id === kickobj.target) 
      {
        console.log('----------------------------------------');
        console.log('               no kick myself           ');
        console.log('----------------------------------------'); 
        socket.emit("kick", false);
        return;
      } 
      
      // target이 호스트일 경우 그냥 파.
      if (channel.host === target.id)
      {
        console.log('----------------------------------------');
        console.log('              target is host            ');
        console.log('----------------------------------------'); 
        socket.emit("kick", false);
        return;
      }

      // 추방 대상을 해당 채널에서 제거
      const removeIdx = channel.users.indexOf(kickobj.target);
      if (removeIdx !== -1) 
      {
        channel.users.splice(removeIdx, 1);  // 유저목록에서 삭제
        channel.member--;                    // 이전 채널 멤버 수 줄이기
        
        //만약 타겟이 오퍼레이터였을 경우.
        if (channel.operator.includes(target.id))
        {
          const removeIdx = channel.operator.indexOf(kickobj.target);
          if (removeIdx !== -1) channel.operator.splice(removeIdx, 1);
        }

        target.socket.leave(target.channelname);
        target.channelname = '$home'; // 추방된 사용자는 home 채널로 이동
        target.socket.join(target.channelname);

        let home = this.channels.find(c => c.channelname === target.channelname);
        home.member++;
        home.users.push(target.id);
        socket.emit("kick", true);

        socket.broadcast.to(channel.channelname).emit('update', false);   //퇴장 메시지
        socket.broadcast.to('$home').emit('update', true);                //입장 메시지
      }
   }


    //*********************************************************************//
    //****************************  home   ********************************//
    //*********************************************************************//
    @SubscribeMessage('home')
    async handlehome(@MessageBody() id: number, @ConnectedSocket() socket: Socket) {
      console.log('----------------------------------------');
      console.log('-----------------HOME-------------------');  
      console.log('userId: ', id);
      console.log('----------------------------------------');

      let user = this.users.find(u => u.id === id);
      if (!user) return;
      if (user.channelname === '$home')
      {
        console.log('----------------------------------------');
        console.log('              already home              ');
        console.log('----------------------------------------'); 
        return;
      }

      let home = this.channels.find(c => c.channelname === "$home");
      let beforeChannel = this.channels.find(c => c.channelname === user.channelname);
      if (!beforeChannel) return;

      //이전 채널 객체 수정
      beforeChannel.member--;
      if (beforeChannel.member === 0)
      {
        if (beforeChannel.channelname !== '$home')
        {
          //channels에서 삭제
          const removeChannelIdx = this.channels.findIndex(c => c.channelname === beforeChannel.channelname);
          if (removeChannelIdx !== -1) {
            this.channels.splice(removeChannelIdx, 1);
          }
          //channelnames에서 삭제
          const removeChannelnameIdx = this.channelnames.findIndex(c => c === beforeChannel.channelname);
          if (removeChannelnameIdx !== -1) {
            this.channelnames.splice(removeChannelnameIdx, 1);
          }
        }

        socket.leave(user.channelname);
        user.channelname = home.channelname;
        socket.join(user.channelname);
          
        //이전 channel 객체 삭제
        beforeChannel = null;

        home.member++;                    //이동한 채널 명수 늘리기.
        home.users.push(user.id);         //이동한 채널 유저 목록에 추가.
        socket.emit('home', { flag: true, list: home.users });
        socket.broadcast.to(user.channelname).emit('update', true);
      }
      else
      {
        const removeIdx = beforeChannel.users.indexOf(user.id);
        if (removeIdx !== -1) {
          beforeChannel.users.splice(removeIdx, 1);
        }
          
        //이전 채널에서 유저가 operator였을 경우
        if (beforeChannel.operator.includes(user.id))
        {
          const removeIdx = beforeChannel.operator.indexOf(user.id);
          if (removeIdx !== -1) beforeChannel.operator.splice(removeIdx, 1);
        }

        //이전 채널에서 유저가 host였을 경우
        if (beforeChannel.host === user.id)
        {
          beforeChannel.host = beforeChannel.users[0];
          let newhost = this.users.find(u => u.id === beforeChannel.users[0])
          const newhost_user : User = await this.usersService.findUserById(newhost.id);
          beforeChannel.channelname = newhost_user.nickname;
        }

          socket.leave(user.channelname);
          user.channelname = home.channelname;
          socket.join(user.channelname);

          home.member++;             //이동한 채널 명수 늘리기.
          home.users.push(user.id);  //이동한 채널 유저 목록에 추가.
          socket.emit('join', { flag: true, list: home.users });

          socket.broadcast.to(beforeChannel.channelname).emit('update', false);   //퇴장 메시지
          socket.broadcast.to(user.channelname).emit('update', true);             //입장 메시지
      }
    }
  }