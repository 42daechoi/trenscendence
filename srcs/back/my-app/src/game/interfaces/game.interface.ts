export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

export interface PaddleInfo {
  keyPress: boolean;
  gameID: string;
}

export interface Result {
  key: number;
  date: string;
  winner: string;
  loser: string;
  scoreWinner: number;
  scoreLoser: number;
}
