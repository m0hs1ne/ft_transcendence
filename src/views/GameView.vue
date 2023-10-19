<!-- CanvasComponent.vue -->
<template>
  <div class="flex bg-slate-800 h-screen items-center justify-center">
    <canvas ref="gameCanvas" width="800" height="400" @keydown="handleKeyDown" tabindex="1" class="shadow-lg"></canvas>
  </div>
</template>
  
  
<script >


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
    window.addEventListener('keydown', this.handleKeyDown);
  },

  methods: {
    loopHook() {
      this.draw();
      this.intervalId = setInterval(this.draw, 10);
    },

    draw() {
      this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
      this.drawRect(0, 0, this.Canvas.width, this.Canvas.height, "#1F173D");
      if (this.pos == "Left") {
        this.drawRect(5, this.PaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.drawRect(this.Canvas.width - 20, this.OpponentPaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.DrawScore(this.CurrentPlayerScore, this.OpponentPLayerScore);
      }
      else if (this.pos == "Right") {
        this.drawRect(5, this.OpponentPaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.drawRect(this.Canvas.width - 20, this.PaddleY, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
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
      const context = this.Context;
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


      this.$GameSocket.on('Lose', (data) =>
      {
        clearInterval(this.intervalId);
        const context = this.Context;
        this.drawRect(0, 0, context.canvas.width, context.canvas.height, "#1F173D");
        context.font = "30px Arial";
        context.fillStyle = "#A33A6F";
        context.fillText("You Lose", 400, 200);
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);

      });
      this.$GameSocket.on('Win', (data) => 
      {
        clearInterval(this.intervalId);
        const context = this.Context;
        this.drawRect(0, 0, context.canvas.width, context.canvas.height, "#1F173D");
        context.font = "30px Arial";
        context.fillStyle = "#A33A6F";
        context.fillText("You Win", 370, 170);
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      });

      this.$GameSocket.on('DeleteRoom', (data) => {
        this.$GameSocket.emit("DeleteRoom", {
          roomId: this.RoomId,
        })
      });

    },

    EventsKiller() {
      this.$GameSocket.removeEventListener("startGame");
      this.$GameSocket.removeEventListener("Lose");
      this.$GameSocket.removeEventListener("Win");
      this.$GameSocket.removeEventListener("DeleteRoom");
      this.$GameSocket.removeEventListener("updateBall");
      this.$GameSocket.removeEventListener("Score");
      this.$GameSocket.removeEventListener("OpponentPaddle");
    },

    JoinGameEvent() {
      this.$GameSocket.emit("joinRoom", {
        mode: this.mode,
      });
    },

    DrawScore(score1, score2) {
      var s1 = score1;
      var s2 = score2;
      const context = this.Context;
      context.font = "30px Arial";
      context.fillStyle = "#A33A6F";
      context.fillText(s1, 370, 25);
      context.fillText(":", 400, 25);
      context.fillText(s2, 422, 25);
    },

    handleKeyDown(event) {
      const keyCode = event.keyCode;
      if (keyCode === 38 && this.PaddleY >= 0) {
        this.PaddleY -= 8;
        this.$GameSocket.emit("PaddleUpdates", {
          pos: this.pos,
          roomId: this.RoomId,
          Paddle: this.PaddleY,
        });
      }
      else if (keyCode === 40 && this.PaddleY + this.PaddleHeight <= 400) {
        this.PaddleY += 8;
        this.$GameSocket.emit("PaddleUpdates", {
          pos: this.pos,
          roomId: this.RoomId,
          Paddle: this.PaddleY,
        });
      }
    },
  },

  mounted() {
    console.log("mounted ");
    this.Canvas = this.$refs.gameCanvas;
    this.Context = this.Canvas.getContext("2d");
    this.$refs.gameCanvas.focus();
    this.EventsHandler();
    this.JoinGameEvent();
    this.loopHook();
  },
  unmounted() 
  {
    this.EventsKiller();
    // console.log("unmounted ", this.c);
    this.$GameSocket.emit("PlayerLeave", {
      roomId: this.RoomId,
      pos: this.pos,
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