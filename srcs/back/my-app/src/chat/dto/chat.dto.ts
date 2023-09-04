import { Socket } from "socket.io";

//* chat-req & rep obj
export class chatDTO {
    nickname: string;
    target: string; //home에서 귓속말 시, usernickname 
    flag: string; // broad or dm
    msg: string;
}

//* kick-req obj
export class kickDTO {
    nickname: string;
    target: string;
}

//* join-req obj
export class joinDTO {
    nickname: string;
    channelname: string; //여기서 타겟은 채널명인가?
    password?: string | null;
}

//* create & modify-req obj
export class roomDTO {
    nickname: string;
    maxmember: number;
    option: string;
    password?: string | null;
}

//* op-req obj
export class opDTO {
    nickname: string;
    target: string;
}


//* where-rep obj
export class channelDTO {
    channelname: string;
    host?: string | null; //home에 경우 host 없음.
    operator: string[];
    users: string[];
    state: string;
    member: number;
    maxmember: number;
    option: string;
    password?: string | null;
}

//* userDTO (서버에서 관리)
export class userDTO {
    socketid: string;
    nickname: string;
    channelname: string;
    socket: Socket;
}
