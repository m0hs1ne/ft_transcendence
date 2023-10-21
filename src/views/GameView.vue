<!-- CanvasComponent.vue -->
<template>
  <div class="flex bg-slate-800 h-screen items-center justify-center">
    <canvas id="gameCanvas" @keydown="handleKeyDown" tabindex="1" class="shadow-lg"></canvas>
  </div>
</template>
  
  
<script lang="ts">

import { app } from '../main'
import type {Socket} from 'socket.io-client';


export default {



  data() {
    return {
      BallX: 0,
      BallY: 0,
      mode: 7,
      CurrentPlayerScore: 0,
      OpponentPLayerScore: 0,
      PaddleHeight: 0,
      PaddleWidth: 0,
      PaddleY: 0,
      OpponentPaddleY: 0,
      intervalId: null as any | null,
      RoomId: null as string | null,
      pos: null as string | null,
      Context: null as CanvasRenderingContext2D | null,
      Canvas: null as HTMLCanvasElement | null,
      GameSocket: null as Socket | null,
    };
  },

  created() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.CanvasResize);
  },

  methods:
  {
    loopHook() {
      this.draw();
      this.intervalId = setInterval(this.draw, 10);
    },

    draw() {
      if (this.Context && this.Canvas) {
        this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
        this.drawRect(0, 0, this.Canvas.width, this.Canvas.height, "#1F173D");
        var x = this.PaddleWidth * 0.2;
        if (this.pos == "Left") {
          this.drawRect(x, this.PaddleY * this.Canvas.height, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
          this.drawRect(this.Canvas.width - (this.PaddleWidth + x), this.OpponentPaddleY * this.Canvas.height, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
          // this.DrawScore(this.CurrentPlayerScore, this.OpponentPLayerScore);
        }
        else if (this.pos == "Right") {
          this.drawRect(x, this.OpponentPaddleY * this.Canvas.height, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
          this.drawRect(this.Canvas.width - (this.PaddleWidth + x), this.PaddleY * this.Canvas.height, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
          // this.DrawScore(this.OpponentPLayerScore, this.CurrentPlayerScore);
        }
        this.drawBall(this.BallX * this.Canvas.width, this.BallY * this.Canvas.height, this.Canvas.width * 0.01, "#A33A6F");
      }
    },

    CanvasResize() {
      if (this.Canvas) {
        this.Canvas.width = window.innerWidth * 0.8;
        this.Canvas.height = this.Canvas.width * 0.5;
        this.PaddleHeight = this.Canvas.height * 0.25;
        this.PaddleWidth = this.Canvas.width * 0.02;
      }
    },

    drawBall(x: number, y: number, radius: any, color: any) {
      if (this.Context) {
        this.Context.fillStyle = color;
        this.Context.beginPath();
        this.Context.arc(x, y, radius, 0, Math.PI * 2);
        this.Context.fill();
      }
    },

    drawRect(x: number, y: number, width: number, height: number, color: any) {
      if (this.Context) {
        this.Context.fillStyle = color;
        this.Context.fillRect(x, y, width, height);
      }
    },

    EventsHandler() {
      if (this.GameSocket) {
        this.GameSocket.on('updateBall', (data: any) => {
          this.BallX = data.x;
          this.BallY = data.y;
        });

        this.GameSocket.on('OpponentPaddle', (data: any) => {
          this.OpponentPaddleY += data.Paddle;
        });

        this.GameSocket.on('startGame', (data: any) => {
          this.RoomId = data.id;
          this.pos = data.pos;
        });

        this.GameSocket.on('Score', (data: any) => {
          this.CurrentPlayerScore = data.Current;
          this.OpponentPLayerScore = data.Oponent;
        });

        this.GameSocket.on('Lose', (data: any) => {
          clearInterval(this.intervalId);
          if (this.Canvas && this.Context) {
            this.drawRect(0, 0, this.Canvas.width, this.Canvas.height, "#1F173D");
            this.Context.font = "30px Arial";
            this.Context.fillStyle = "#A33A6F";
            this.Context.fillText("You Lose", 400, 200);
            setTimeout(() => {
              this.$router.push("/");
            }, 2000);
          }
        });

        this.GameSocket.on('Win', (data: any) => {
          clearInterval(this.intervalId);
          if (this.Canvas && this.Context) {
            this.drawRect(0, 0, this.Canvas.width, this.Canvas.height, "#1F173D");
            this.Context.font = "30px Arial";
            this.Context.fillStyle = "#A33A6F";
            this.Context.fillText("You Win", 370, 170);
            setTimeout(() => {
              this.$router.push("/");
            }, 2000);
          }
        });

        this.GameSocket.on('DeleteRoom', (data: any) => {
          if (this.GameSocket) {
            this.GameSocket.emit("DeleteRoom", {
              roomId: this.RoomId,
            })
          }
        });
      }
    },

    EventsKiller() {
      if (this.GameSocket) {
        this.GameSocket.off("startGame");
        this.GameSocket.off("Lose");
        this.GameSocket.off("Win");
        this.GameSocket.off("DeleteRoom");
        this.GameSocket.off("updateBall");
        this.GameSocket.off("Score");
        this.GameSocket.off("OpponentPaddle");
      }
    },

    JoinGameEvent() {
      if (this.GameSocket) {
        this.GameSocket.emit("joinRoom", {
          mode: this.mode,
        });
      }
    },

    // DrawScore()
    // {
    //   let s1: string = this.CurrentPlayerScore.to;
    //   var s2 = this.OpponentPLayerScore;
    //   if(this.Context)
    //   {
    //     this.Context.font = "30px Arial";
    //     this.Context.fillStyle = "#A33A6F";
    //     this.Context.fillText(s1.toString, 370, 25);
    //     this.Context.fillText(":", 400, 25);
    //     this.Context.fillText(s2, 422, 25);
    //     }
    // }

    handleKeyDown(event: any) {
      const keyCode = event.keyCode;
      if (keyCode == 38 && this.PaddleY > 0) {
        this.PaddleY -= 0.02;
        if (this.GameSocket) {
          this.GameSocket.emit("PaddleUpdates", {
            pos: this.pos,
            roomId: this.RoomId,
            Paddle: -0.02,
          });
        }
      }
      else if (keyCode == 40 && this.PaddleY + 0.25 < 1) {
        this.PaddleY += 0.02;
        if (this.GameSocket) {
          this.GameSocket.emit("PaddleUpdates", {
            pos: this.pos,
            roomId: this.RoomId,
            Paddle: 0.02,
          });
        }
      }
    },
  },

  mounted() {
    console.log("mounted ");
    this.GameSocket = app.config.globalProperties.$GameSocket;
    this.Canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
    if (this.Canvas) {
      this.Context = this.Canvas.getContext("2d");
      this.Canvas.width = window.innerWidth * 0.8;
      this.Canvas.height = this.Canvas.width * 0.5;
      this.PaddleHeight = this.Canvas.height * 0.25;
      this.PaddleWidth = this.Canvas.width * 0.02;
      this.PaddleY = 0.4;
      this.OpponentPaddleY = 0.4;
      this.BallX = 0.5;
      this.BallY = 0.5;
      this.Canvas.focus();
      this.EventsHandler();
      this.JoinGameEvent();
      this.loopHook();
    }
  },
  unmounted() {
    this.EventsKiller();
    if(this.GameSocket)
    {    
      this.GameSocket.emit("PlayerLeave", {
      roomId: this.RoomId,
      pos: this.pos,
    });
    }
    clearInterval(this.intervalId);
  }

};

</script>
  
<style scoped>
body {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
}

canvas {
  border: 2px solid black;
  border-radius: 15px;
}
</style>