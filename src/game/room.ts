import { Socket } from 'socket.io';


export class Room {
  id: number;
  RightPlayer: {
    socket: Socket,
    Paddle: number;
    Score: number;
    id: number;
  }

  LeftPlayer: {
    socket: Socket,
    Paddle: number;
    Score: number;
    id: number;
  }

  PaddleHeight: number;
  PaddleWidth: number;
  closeroom: boolean;
  IntervalId: any;
  GameMode: number;
  angle: number;
  Winner: number;

  roomId: string;
  ballPosition: { x: number; y: number } = { x: 0.5, y: 0.5 };
  ballDirection: { x: number; y: number } = {x: 0, y:0};

  constructor(rightPlayerSocket: Socket, leftPlayerSocket: Socket) {
    this.RightPlayer = {
      socket: rightPlayerSocket,
      Paddle: 0.4,
      Score: 0,
      id: null,
    };

    this.LeftPlayer = {
      socket: leftPlayerSocket,
      Paddle: 0.4,
      Score: 0,
      id: null,
    };
    this.closeroom = false;
    this.angle = Math.random() * (Math.PI/4 - (-Math.PI/4)) + (-Math.PI/4);
    this.ballDirection.x = 2 * Math.cos(this.angle);
    this.ballDirection.y = 2 * Math.sin(this.angle);

  }

  Play(): void {
    this.RightPlayer.socket.emit('startGame', {
      id: this.roomId,
      pos: "Right",
    })
    this.LeftPlayer.socket.emit('startGame', {
      id: this.roomId,
      pos: "Left",
    })
    this.startGameLoop();
  }

  startGameLoop() {
    this.IntervalId = setInterval(() => {
      if (this.closeroom == true) {
        clearInterval(this.IntervalId);
        console.log("It should stop know");
      }
      else 
      {
        this.ballPosition.x += this.ballDirection.x * 0.002;
        this.ballPosition.y += this.ballDirection.y * 0.002;
        this.CheckBall();
        this.LeftPlayer.socket.emit('updateBall', 
        {
          x: this.ballPosition.x,
          y: this.ballPosition.y,
        });

        this.RightPlayer.socket.emit('updateBall', {
          x: this.ballPosition.x,
          y: this.ballPosition.y,
        });
      }
    }, 1000 / 60);
  }

  CheckBall(): void 
  {
    if(this.checkGoals()){}
    else if(!this.checkLeftPadlleCollision()){}
    else
      this.checkRightPadlleCollision();
    this.checkWallCollision();
    
  }

  checkLeftPadlleCollision(): number
  {
    if (this.ballPosition.x <= 0.03 &&  this.LeftPlayer.Paddle - 0.01  <= this.ballPosition.y
        && this.LeftPlayer.Paddle + 0.25 + 0.01  >= this.ballPosition.y)
    {
      // var diff = this.ballPosition.y - this.LeftPlayer.Paddle;
			// var angle = this.map(diff * 100, 0, 25, -Math.PI, Math.PI);
			// this.ballDirection.x = -2 * Math.cos(angle);
			// this.ballDirection.y = 2 * Math.sin(angle);
      this.ballDirection.x *= -1;
      return 0;
    }
    return 1;
  }
  // map(
  //   value: number,
  //   fromMin: number,
  //   fromMax: number,
  //   toMin: number,
  //   toMax: number
  // ): number {
  //   return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
  // }

  checkRightPadlleCollision(): number {
    if (this.ballPosition.x >= 0.97 && this.RightPlayer.Paddle - 0.01 <= this.ballPosition.y
      && this.RightPlayer.Paddle + 0.25 + 0.01 >= this.ballPosition.y)   
    {
      this.ballDirection.x *= -1;
      return 0;
    }
    return 1;
  }

  checkWallCollision(): void {
    if (this.ballPosition.y < 0.02) {
      this.ballDirection.y *= -1;
    }
    else if (this.ballPosition.y > 0.98) {
      this.ballDirection.y *= -1;
    }
  }
  
  checkGoals(): number 
  {
    if (this.ballPosition.x <= 0.02) {
      this.RightPlayer.Score++;
      if (this.RightPlayer.Score == this.GameMode) {
        this.EndTheGame();
      }
      else
        this.EmitScore();
      return 1;
    }
    else if (this.ballPosition.x >= 0.98) {
      this.LeftPlayer.Score++;
      if (this.LeftPlayer.Score == this.GameMode) {
        this.EndTheGame();
      }
      else
        this.EmitScore();
      return 1;
    }
    return 0;
  }

  EmitScore(): void {
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
    this.ballPosition.x = 0.5;
    this.ballPosition.y = 0.5;
  }

  EndTheGame(): void {
    if (this.RightPlayer.Score > this.LeftPlayer.Score) {
      this.RightPlayer.socket.emit("Win");
      this.LeftPlayer.socket.emit("Lose");
      this.RightPlayer.socket.emit("DeleteRoom", {
        roomId: this.roomId,
      });
      this.Winner = this.RightPlayer.id;
    }
    else {
      this.RightPlayer.socket.emit("Lose");
      this.LeftPlayer.socket.emit("Win");
      this.LeftPlayer.socket.emit("DeleteRoom", {
        roomId: this.roomId,
      });
      this.Winner = this.LeftPlayer.id;
    }
    this.closeroom = true;
  }

  PlayerLeaves(pos: string): void {
    if (pos == "Right") {
      this.LeftPlayer.socket.emit("Win");
      this.Winner = this.LeftPlayer.id;
      this.RightPlayer.Score = 0;
      this.LeftPlayer.Score = this.GameMode;
    }
    else {
      this.RightPlayer.socket.emit("Win");
      this.Winner = this.RightPlayer.id;
      this.LeftPlayer.Score = 0;
      this.RightPlayer.Score = this.GameMode;
    }
    this.closeroom = true;
  }
}
