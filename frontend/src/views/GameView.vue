<!-- CanvasComponent.vue -->
<template>
	<div class="flex dark:bg-slate-800 h-screen items-center justify-center">
		<canvas ref="gameCanvas" width="800" height="400" @keydown="handleKeyDown" tabindex="1"></canvas>
	</div>
</template>
  
  
  <script>
  
  import { io } from 'socket.io-client';
    
  export default {
    data() {
      return {
        x: 50,
        y: 50,
        intervalId: null,
        RoomId: null,
        pos: null,
        socket: null,
        PaddleHeight: 120,
        PaddleWidth: 15,
        PaddleY:20,
        OpponentPaddleY: 20,
      };
    },
    created() {
      console.log("Start here");
      window.addEventListener('keydown', this.handleKeyDown);
      this.socket = io('http://localhost:3000'), {
        withCredentials: true,
      };
      console.log(this.socket);
    },
  
    methods: {
      loopHook() {
        console.log("LoopHook");
        this.draw();
        this.intervalId = setInterval(this.draw, 1000 / 60);
      },
      draw() {
        const canvas = this.$refs.gameCanvas;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.drawRect(0, 0, canvas.width, canvas.height, "#1F173D");
        if(this.pos == "Left")
        {
          this.drawRect(5, this.PaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
          this.drawRect(canvas.width - 15, this.OpponentPaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        }
        else if(this.pos == "Right")
        {
          this.drawRect(5, this.OpponentPaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
          this.drawRect(canvas.width - 15, this.PaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        }
        this.drawBall(this.x, this.y, 10, "#A33A6F");
      },
  
      drawBall(x, y, radius, color) {
        const context = this.$refs.gameCanvas.getContext("2d");
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      },
  
      drawRect(x, y, width, height, color) {
        const context = this.$refs.gameCanvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
      },
  
      EventsHandler() 
      {
  
        this.socket.on('updateBall', (data) => {
          this.x = data.x;
          this.y = data.y;
        });
  
        this.socket.on('OpponentPaddle', (data) => {
          this.OpponentPaddleY = data.Paddle;
        });
  
        this.socket.on('startGame', (data) => {
          this.RoomId = data.id;
          this.pos = data.pos;
        });
      },
  
      JoinGameEvent() {
        this.socket.emit("joinRoom");
      },
  
      handleKeyDown(event) {
        const keyCode = event.keyCode;
        if (keyCode === 38 && this.PaddleY >= 0) 
        {
          this.PaddleY -= 5;
          this.socket.emit("PaddleUpdates", {
            pos: this.pos,
            roomId: this.RoomId,
            Paddle: this.PaddleY - 5,
          });
        }
        else if (keyCode === 40 && this.PaddleY + this.PaddleHeight <= 400) 
        {
          this.PaddleY += 5
          this.socket.emit("PaddleUpdates", {
            pos: this.pos,
            roomId: this.RoomId,
            Paddle: this.PaddleY + 5,
          });
        }
      },
  
  
    },
  
    mounted() {
      this.EventsHandler();
      this.JoinGameEvent();
      this.loopHook();
      this.$refs.gameCanvas.focus();
    },
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