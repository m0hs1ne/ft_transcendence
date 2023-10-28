import { Socket } from "socket.io";

export class Room {
  id: number;
  RightPlayer: {
    socket: Socket;
    Paddle: number;
    Score: number;
    id: number;
  };

  LeftPlayer: {
    socket: Socket;
    Paddle: number;
    Score: number;
    id: number;
  };

  PaddleHeight: number;
  PaddleWidth: number;
  closeroom: boolean;
  IntervalId: any;
  GameMode: number;
  angle: number;
  Winner: number;
  BallSpeed: number;

  roomId: string;
  ballPosition: { x: number; y: number } = { x: 0.5, y: 0.5 };
  ballDirection: { x: number; y: number } = { x: 0, y: 0 };

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
    this.angle = Math.random() * (Math.PI / 4 - -Math.PI / 4) + -Math.PI / 4;
    this.ballDirection.x = 2 * Math.cos(this.angle);
    this.ballDirection.y = 2 * Math.sin(this.angle);
    this.BallSpeed = 0.002;
  }

  Play(): void {
    this.RightPlayer.socket.emit("startGame", {
      id: this.roomId,
      pos: "Right",
      CurrentID: this.RightPlayer.id,
      OpponentID: this.LeftPlayer.id,
    });
    this.LeftPlayer.socket.emit("startGame", {
      id: this.roomId,
      pos: "Left",
      CurrentID: this.LeftPlayer.id,
      OpponentID: this.RightPlayer.id,
    });
    this.startGameLoop();
  }

  startGameLoop() 
  {
    var delay = 0;
    this.IntervalId = setInterval(() => {
      if (this.closeroom == true) {
        clearInterval(this.IntervalId);
      } else {
        if(delay == 0)
        {
          this.ballPosition.x += this.ballDirection.x * this.BallSpeed;
          this.ballPosition.y += this.ballDirection.y * this.BallSpeed;
          this.BallSpeed += 0.0000003;
        }
        if(this.CheckBall() == 2)
        {
          delay = 1;
          setTimeout(() => {
            delay = 0;
          }, 500);
        }
        this.LeftPlayer.socket.emit("updateBall", {
          x: this.ballPosition.x,
          y: this.ballPosition.y,
        });

        this.RightPlayer.socket.emit("updateBall", {
          x: this.ballPosition.x,
          y: this.ballPosition.y,
        });
      }
    }, 10);
  }

  CheckBall(): number {
    if (this.checkGoals()) 
      return 2;
    else if (!this.checkLeftPadlleCollision()) {
    } 
    else 
      this.checkRightPadlleCollision();
    this.checkWallCollision();
    return 0;
  }

  checkLeftPadlleCollision(): number 
  {
    var rad = (45 * Math.PI) / 180;
    if (
      this.ballPosition.x <= 0.03 &&
      this.LeftPlayer.Paddle - 0.01 <= this.ballPosition.y &&
      this.LeftPlayer.Paddle + 0.25 + 0.01 >= this.ballPosition.y
    ) {
      var diff = this.ballPosition.y - this.LeftPlayer.Paddle;
      var angle = this.map(diff * 100, 0, 25, -rad, rad);
      this.ballDirection.x = 2 * Math.cos(angle);
      this.ballDirection.y = 2 * Math.sin(angle);
      return 0;
    }
    return 1;
  }
  map(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
  ): number {
    return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
  }

  checkRightPadlleCollision(): number 
  {
    var rad = (45 * Math.PI) / 180;
    if (
      this.ballPosition.x >= 0.97 &&
      this.RightPlayer.Paddle - 0.01 <= this.ballPosition.y &&
      this.RightPlayer.Paddle + 0.25 + 0.01 >= this.ballPosition.y
    ) 
    {
      var diff = this.ballPosition.y - this.RightPlayer.Paddle;
      var angle = this.map(diff * 100, 0, 25, -rad, rad);
      this.ballDirection.x = (2 * Math.cos(angle)) * -1;
      this.ballDirection.y = 2 * Math.sin(angle);
      return 0;
    }
    return 1;
  }

  checkWallCollision(): void {
    if (this.ballPosition.y < 0.02) {
      this.ballDirection.y *= -1;
    } else if (this.ballPosition.y > 0.98) {
      this.ballDirection.y *= -1;
    }
  }

  checkGoals(): number {
    if (this.ballPosition.x <= 0.02) {
      this.RightPlayer.Score++;
      if (this.RightPlayer.Score == this.GameMode) {
        this.EndTheGame();
      } else this.EmitScore();
      return 1;
    } else if (this.ballPosition.x >= 0.98) {
      this.LeftPlayer.Score++;
      if (this.LeftPlayer.Score == this.GameMode) {
        this.EndTheGame();
      } else this.EmitScore();
      return 1;
    }
    return 0;
  }

  EmitScore(): void {
    this.RightPlayer.socket.emit("Score", {
      Current: this.RightPlayer.Score,
      Oponent: this.LeftPlayer.Score,
    });
    this.LeftPlayer.socket.emit("Score", {
      Current: this.LeftPlayer.Score,
      Oponent: this.RightPlayer.Score,
    });
    this.ballPosition.x = 0.5;
    this.ballPosition.y = 0.5;
    this.BallSpeed = 0.002;
  }

  EndTheGame(): void {
    if (this.RightPlayer.Score > this.LeftPlayer.Score) {
      this.RightPlayer.socket.emit("Win");
      this.LeftPlayer.socket.emit("Lose");
      this.RightPlayer.socket.emit("DeleteRoom", {
        roomId: this.roomId,
      });
      this.Winner = this.RightPlayer.id;
    } else {
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
    } else {
      this.RightPlayer.socket.emit("Win");
      this.Winner = this.RightPlayer.id;
      this.LeftPlayer.Score = 0;
      this.RightPlayer.Score = this.GameMode;
    }
    this.closeroom = true;
  }
}
