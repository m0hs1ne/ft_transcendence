import { Socket } from 'socket.io';


export class Room {

  RightPlayer: {
    socket: Socket,
    Paddle: number;
    Score: number;
  }

  LeftPlayer: {
    socket: Socket,
    Paddle: number;
    Score: number;
  }

  PaddleHeight: number;
  PaddleWidth: number;

  closeroom: boolean;
  IntervalId: any;

  roomsId: number;
  ballPosition: { x: number; y: number } = { x: 400, y: 200 };
  ballDirection: { x: number; y: number } = { x: 1, y: 1 };

  constructor(rightPlayerSocket: Socket, leftPlayerSocket: Socket) {
    this.RightPlayer = {
      socket: rightPlayerSocket,
      Paddle: 200,
      Score: 0,
    };

    this.LeftPlayer = {
      socket: leftPlayerSocket,
      Paddle: 200,
      Score: 0,
    };

    this.closeroom = false;
  }

  Play(): void {
    this.RightPlayer.socket.emit('startGame', {
      id: this.roomsId,
      pos: "Right",
    })
    this.LeftPlayer.socket.emit('startGame', {
      id: this.roomsId,
      pos: "Left",
    })
    this.startGameLoop();
  }

  startGameLoop() {
    this.IntervalId = setInterval(() => {
      this.ballPosition.x += this.ballDirection.x * 4;
      this.ballPosition.y += this.ballDirection.y * 4;

      this.CheckBall();
      this.LeftPlayer.socket.emit('updateBall', {
        x: this.ballPosition.x,
        y: this.ballPosition.y,
      });

      this.RightPlayer.socket.emit('updateBall', {
        x: this.ballPosition.x,
        y: this.ballPosition.y,
      });
      if (this.closeroom == true) {
        clearInterval(this.IntervalId);
        console.log("It should stop know");
      }
    }, 1000 / 60);
  }

  CheckBall(): void {
    this.checkLeftPadlleCollision();
    this.checkRightPadlleCollision();
    this.checkWallCollision();
    this.checkGoals();
  }

  checkLeftPadlleCollision(): void {
    if (this.ballPosition.x <= 20 && this.LeftPlayer.Paddle <= this.ballPosition.y
      && this.LeftPlayer.Paddle + 120 >= this.ballPosition.y) {
      this.ballDirection.x *= +this.ballDirection.x;
    }
  }

  checkRightPadlleCollision(): void {
    if (this.ballPosition.x >= 780 && this.RightPlayer.Paddle <= this.ballPosition.y
      && this.RightPlayer.Paddle + 120 >= this.ballPosition.y) {
      this.ballDirection.x *= -this.ballDirection.x;
    }
  }

  checkWallCollision(): void {
    if (this.ballPosition.y <= 0) {
      this.ballDirection.y *= +this.ballDirection.y;
    }
    else if (this.ballPosition.y >= 400) {
      this.ballDirection.y *= -this.ballDirection.y;
    }
  }
  checkGoals(): void {
    if (this.ballPosition.x <= 0) 
    {
      this.RightPlayer.Score++;
      this.LeftPlayer.socket.emit("Score",
      {
        Current: this.LeftPlayer.Score,
        Oponent: this.RightPlayer.Score,
      });
      this.RightPlayer.socket.emit("Score",
      {
        Current: this.RightPlayer.Score,
        Oponent: this.LeftPlayer.Score
      });
      this.ballPosition.x = 400;
      this.ballPosition.y = 200;
    }
    else if(this.ballPosition.x >= 800)
    {
      this.LeftPlayer.Score++;
      this.RightPlayer.socket.emit("Score",
      {
        Current: this.RightPlayer.Score,
        Oponent: this.LeftPlayer.Score
      });
      this.LeftPlayer.socket.emit("Score",
      {
        Current: this.LeftPlayer.Score,
        Oponent: this.RightPlayer.Score,
      });
      this.ballPosition.x = 400;
      this.ballPosition.y = 200;
    }
  }
}