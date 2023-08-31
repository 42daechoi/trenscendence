export class htmlItem {
    x :number;
    y :number;
    width :number;
    height :number;
    len :number;
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.len = 0;
    }
    isEqual(other) {
      this.x = other.x;
      this.y = other.y;
      this.width = other.width;
      this.height = other.height;
      this.len = other.len;
    }
}

export class ballItem {
    x :number;
    y :number;
    dx :number;
    dy :number;
    v :number;
    r :number;
    temp :number;
    constructor(x, y, dx, dy, v, r){
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.v = v;
      this.r = r;
      this.temp = -1;
    }
    isEqual(other){
      this.x = other.x;
      this.y = other.y;
      this.dx = other.dx;
      this.dy = other.dy;
      this.v = other.v;
      this.r = other.r;
      this.temp = other.temp;
    } 
    init(x, y, dx ,dy, v,r,temp){
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.v = v;
      this.r = r;
      this.temp = temp;
    }
}
export class padItem {
    x :number;
    y :number;
    width :number;
    height :number;
    color :string;
    radi :number;
    constructor(x, y, width, height, color, radi) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.radi = parseInt(radi);
    }
    isEqual(other) {
      this.x = other.x;
      this.y = other.y;
      this.width = other.width;
      this.height = other.height;
      this.color = other.color;
      this.radi = other.radi;
    }
}

export class game {
    pad :padItem[];
    board_x :number;
    board_y :number;
    ball :ballItem;
    obs :htmlItem[];
    intervalId : NodeJS.Timeout;
    constructor(pad, board_x, board_y, ball, obs){
      this.pad = pad;
      this.board_x = board_x;
      this.board_y = board_y;
      this.ball = ball;
      this.obs = obs;
    }
}