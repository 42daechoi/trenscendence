import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/typeorm';
import { userDTO, channelDTO, chatDTO } from './dto/chat.dto';
import { Socket } from 'socket.io';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';


@Injectable()
export class ChatService {
    
    constructor(private readonly usersService: UsersService){};
    private users: userDTO[] = [];
    private channels: channelDTO[] = [];

    getUsers(): userDTO[] {
        return this.users;
    }

    findUserById(@MessageBody() id: number): userDTO {
        let user = this.users.find(u => u.id === id);
        return (user);
    }

    findUserBySocketId(@MessageBody() skid: string) : userDTO {
        let user = this.users.find(u => u.socketid === skid);
        return (user);
    }

    getChannels(): channelDTO[] {
        return this.channels;
    }

    findChannelByChannelname(@MessageBody() chname: string) : channelDTO {
        let channel = this.channels.find(c => c.channelname === chname);
        return channel;
    }
  
    async getUserBlocklist(@MessageBody() id: number) {
        const block_users : User[] = await this.usersService.getUserBlocks(id);
        let   block_list : Map<number, string> = new Map();

        for (const blockuser of block_users) {
            block_list.set(blockuser.id, blockuser.nickname);
        }
            
        return block_list;
    }


}