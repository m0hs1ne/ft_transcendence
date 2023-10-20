<!-- CanvasComponent.vue -->
<template>
  <div class="flex bg-slate-800 h-screen items-center justify-center">
    <canvas ref="gameCanvas" @keydown="handleKeyDown" tabindex="1" class="shadow-lg"></canvas>
  </div>
</template>
  
  
<script >


export default {
  data() {
    return {
      BallX: null,
      BallY: null,
      mode: 7,
      CurrentPlayerScore: 0,
      OpponentPLayerScore: 0,
      intervalId: null,
      RoomId: null,
      pos: null,
      PaddleHeight: null,
      PaddleWidth: null,
      PaddleY: null,
      OpponentPaddleY: null,
      Context: null,
      Canvas: null,
    };
  },

  created() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.CanvasResize);
  },

  methods: {
    loopHook() {
      this.draw();
      this.intervalId = setInterval(this.draw, 10);
    },

    draw() {
      this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
      this.drawRect(0, 0, this.Canvas.width, this.Canvas.height, "#1F173D");
      var x = this.PaddleWidth * 0.2;
      if (this.pos == "Left") 
      {
        this.drawRect(x, this.PaddleY * this.Canvas.height , this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.drawRect(this.Canvas.width - (this.PaddleWidth + x), this.OpponentPaddleY * this.Canvas.height, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        // this.DrawScore(this.CurrentPlayerScore, this.OpponentPLayerScore);
      }
      else if (this.pos == "Right") 
      {
        this.drawRect(x, this.OpponentPaddleY * this.Canvas.height, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        this.drawRect(this.Canvas.width - (this.PaddleWidth + x), this.PaddleY *  this.Canvas.height, this.PaddleWidth, this.PaddleHeight, "#A33A6F");
        // this.DrawScore(this.OpponentPLayerScore, this.CurrentPlayerScore);
      }
      this.drawBall(this.BallX * this.Canvas.width, this.BallY * this.Canvas.height, this.Canvas.width * 0.01, "#A33A6F");
    },

    CanvasResize() {
      this.Canvas.width = window.innerWidth * 0.8;
      this.Canvas.height = this.Canvas.width * 0.5;
      this.PaddleHeight = this.Canvas.height * 0.25;
      this.PaddleWidth = this.Canvas.width * 0.02;
    },

    drawBall(x, y, radius, color) {
      this.Context.fillStyle = color;
      this.Context.beginPath();
      this.Context.arc(x, y, radius, 0, Math.PI * 2);
      this.Context.fill();
    },

    drawRect(x, y, width, height, color) {
      this.Context.fillStyle = color;
      this.Context.fillRect(x, y, width, height);
    },

    EventsHandler() {
      this.$GameSocket.on('updateBall', (data) => {
        this.BallX = data.x;
        this.BallY = data.y;
      });

      this.$GameSocket.on('OpponentPaddle', (data) => 
      {
        this.OpponentPaddleY += data.Paddle;
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
        this.drawRect(0, 0, this.Canvas.width, this.Canvas.height, "#1F173D");
        this.Context.font = "30px Arial";
        this.Context.fillStyle = "#A33A6F";
        this.Context.fillText("You Lose", 400, 200);
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);

      });
      this.$GameSocket.on('Win', (data) => 
      {
        clearInterval(this.intervalId);
        this.drawRect(0, 0, this.Canvas.width, this.Canvas.height, "#1F173D");
        this.Context.font = "30px Arial";
        this.Context.fillStyle = "#A33A6F";
        this.Context.fillText("You Win", 370, 170);
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

    EventsKiller() {this.ballDirection.y * 0.002;
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
      if (keyCode == 38 && this.PaddleY > 0) {
        this.PaddleY -= 0.02;
        this.$GameSocket.emit("PaddleUpdates", {
          pos: this.pos,
          roomId: this.RoomId,
          Paddle: -0.02,
        });
      }
      else if (keyCode == 40 && this.PaddleY + 0.25  < 1) {
        this.PaddleY += 0.02;
        this.$GameSocket.emit("PaddleUpdates", {
          pos: this.pos,
          roomId: this.RoomId,
          Paddle: 0.02,
        });
      }
    },
  },

  mounted() {
    console.log("mounted ");
    this.Canvas = this.$refs.gameCanvas;
    this.Context = this.Canvas.getContext("2d");
    this.Canvas.width = window.innerWidth * 0.8;
    this.Canvas.height = this.Canvas.width * 0.5;
    this.PaddleHeight = this.Canvas.height * 0.25;
    this.PaddleWidth = this.Canvas.width * 0.02;
    this.PaddleY = 0.4;
    this.OpponentPaddleY = 0.4;
    this.BallX = 0.5;
    this.BallY = 0.5;
    this.$refs.gameCanvas.focus();
    this.EventsHandler();
    this.JoinGameEvent();
    this.loopHook();
  },
  unmounted() 
  {
    this.EventsKiller();
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