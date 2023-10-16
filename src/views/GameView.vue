<!-- CanvasComponent.vue -->
<template>
  <div class="flex bg-slate-800 h-screen items-center justify-center">
    <canvas ref="gameCanvas" width="800" height="400" @keydown="handleKeyDown" tabindex="1" class="shadow-lg"></canvas>
  </div>
</template>
  
  
<script>

// import { io } from 'socket.io-client';

export default {
  data() {
    return {
      x: 50,
      y: 50,
      mode: 7,
      CurrentPlayerScore: 0,
      OpponentPLayerScore: 0,
      intervalId: null,
      RoomId: null,
      pos: null,
      PaddleHeight: 120,
      PaddleWidth: 15,

      PaddleY: 200,
      OpponentPaddleY: 200,
      Context: null,
      Canvas: null,
    };
  },
  created() {
    console.log("Start here");
    window.addEventListener('keydown', this.handleKeyDown);

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
      if (this.pos == "Left") {
        this.drawRect(5, this.PaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.drawRect(canvas.width - 15, this.OpponentPaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.DrawScore(this.CurrentPlayerScore, this.OpponentPLayerScore);
      }
      else if (this.pos == "Right") {
        this.drawRect(5, this.OpponentPaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.drawRect(canvas.width - 15, this.PaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.DrawScore(this.OpponentPLayerScore, this.CurrentPlayerScore);
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

    EventsHandler() {
      this.$GameSocket.on('updateBall', (data) => {
        this.x = data.x;
        this.y = data.y;
      });

      this.$GameSocket.on('OpponentPaddle', (data) => {
        this.OpponentPaddleY = data.Paddle;
      });

      this.$GameSocket.on('startGame', (data) => {
        this.RoomId = data.id;
        this.pos = data.pos;
      });
      
      this.$GameSocket.on('Score', (data) => {
        this.CurrentPlayerScore = data.Current;
        this.OpponentPLayerScore = data.Oponent;
      });

      
      this.$GameSocket.on('Lose', (data) => {
      });

      this.$GameSocket.on('win', (data) => {
      });
    },

    JoinGameEvent() {
      this.$GameSocket.emit("joinRoom", {
        mode: this.mode,
      });
    },

    DrawScore(score1, score2) 
    {
      var s1 = score1;
      var s2 = score2;
      const context = this.$refs.gameCanvas.getContext("2d");
      context.font = "30px Arial";
      context.fillStyle = "#A33A6F";
      context.fillText(s1, 370, 25);
      context.fillText(":", 400, 25);
      context.fillText(s2, 422, 25);
    },

    handleKeyDown(event) {
      const keyCode = event.keyCode;
      if (keyCode === 38 && this.PaddleY >= 0) {
        this.PaddleY -= 5;
        this.$GameSocket.emit("PaddleUpdates", {
          pos: this.pos,
          roomId: this.RoomId,
          Paddle: this.PaddleY - 5,
        });
      }
      else if (keyCode === 40 && this.PaddleY + this.PaddleHeight <= 400) {
        this.PaddleY += 5
        this.$GameSocket.emit("PaddleUpdates", {
          pos: this.pos,
          roomId: this.RoomId,
          Paddle: this.PaddleY + 5,
        });
      }
    },
  },

  mounted() {
    this.$refs.gameCanvas.focus();
    this.EventsHandler();
    this.JoinGameEvent();
    this.loopHook();
  },
  unmounted() {
    this.$GameSocket.emit("PlayerLeave", {
          roomId: this.RoomId,
          Socket: this.pos,
        });
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