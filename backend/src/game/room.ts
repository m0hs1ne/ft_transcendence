import { Socket } from 'socket.io';


export class Room {
    RightPlayer: Socket;
    LeftPlayer: Socket;

    LeftPlayerPaddle: number;
    RightPlayerPaddle: number;
    PaddleHeight : number;
    PaddleWidth : number;

    roomsId: number;
    Size : number;
    currentPlayerIndex: number = 0;
    ballPosition: { x: number; y: number } = { x: 400, y: 200 };
    ballDirection: { x: number; y: number } = { x: 1, y: 1 };
  
    constructor() {
      this.currentPlayerIndex = 0;
      this.Size = 0;
      this.PaddleHeight = 120;
      this.PaddleWidth = 15; 
    }
  
    Play(): void
    {
      this.RightPlayer.emit('startGame', {
          id:this.roomsId,
          pos:"Right",
      })
      this.LeftPlayer.emit('startGame', {
        id:this.roomsId,
        pos:"Left",
    })
    this.startGameLoop();
    }
  
    startGameLoop() {
      setInterval(() => {
        this.ballPosition.x += this.ballDirection.x * 4;
        this.ballPosition.y += this.ballDirection.y * 4;
  
        this.CheckBall();
        this.LeftPlayer.emit('updateBall', {
          x: this.ballPosition.x,
          y: this.ballPosition.y,
        });

        this.RightPlayer.emit('updateBall', {
          x: this.ballPosition.x,
          y: this.ballPosition.y,
        });

      }, 1000 / 60); // Adjust the frame rate as needed
    }
    CheckBall(): void
    {
      if (this.ballPosition.x <= 20 && this.LeftPlayerPaddle <= this.ballPosition.y 
        && this.LeftPlayerPaddle + 120 >= this.ballPosition.y) 
      {
        this.ballDirection.x *= +this.ballDirection.x;
      }
      else if (this.ballPosition.x >= 780 && this.RightPlayerPaddle  <= this.ballPosition.y 
        && this.RightPlayerPaddle + 120 >= this.ballPosition.y) 
      {
        this.ballDirection.x *= -this.ballDirection.x;
      }
      // else if(this.ballPosition.x >= 800)
      // {
      //   this.ballDirection.x *= -this.ballDirection.x;
      // }
      else if (this.ballPosition.y <= 0) {
        this.ballDirection.y *= +this.ballDirection.y;
      }
      else if(this.ballPosition.y >= 400)
      {
        this.ballDirection.y *= -this.ballDirection.y;
      }
      else if(this.ballPosition.x <= 0 || this.ballPosition.x >= 800)
      {
        this.ballPosition.x = 400;
        this.ballPosition.y = 200;
      }
    }
  }