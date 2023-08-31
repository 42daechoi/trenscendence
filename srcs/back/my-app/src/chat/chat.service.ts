import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/typeorm';
import { userDTO, channelDTO, chatDTO } from './dto/chat.dto';
import { Socket } from 'socket.io';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';


@Injectable()
export class ChatService {
  constructor(private readonly usersService: UsersService){}

    async getUserBlocklist(@MessageBody() id: number)
    {
        const block_users : User[] = await this.usersService.getUserBlocks(id);
        let   block_list : Map<number, string> = new Map();

        for (const blockuser of block_users) {
            block_list.set(blockuser.id, blockuser.nickname);
        }
        
        return block_list;
    }

    
    

}