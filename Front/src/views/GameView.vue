<!-- CanvasComponent.vue -->
<template>
  <div class="flex flex-col gap-5 bg-white dark:bg-slate-800 h-full min-h-screen items-center justify-center">
    <WaitingModel v-if="gameData.phase === 'W'" />
    <ScoreBar v-if="gameData.phase === 'P'" :leftID="leftID" :rightID="rightID" :leftScore="leftScore" :rightScore="rightScore"
      :limit="mode" />
    <canvas v-if="gameData.phase === 'P'" id="gameCanvas" @keydown="handleKeyDown" tabindex="1" class="shadow-lg"></canvas>
    <button v-if="gameData.phase === 'P'" @click="$router.go(-1)"
      class="text-gray-100 dark:text-white shadow w-fit mt-3 py-5 px-7 bg-gray-500 rounded-md text-2xl font-bold">
      Withdraw
    </button>
    <WinModel v-if="gameData.phase === 'N'" :limit="gameData.modeLimit" />
    <LoseModel v-if="gameData.phase === 'L'" :limit="gameData.modeLimit" />
  </div>
</template>


<script lang="ts">
import { app } from "../main";
import { GameData } from "../stores/state";
import WaitingModel from "./../components/Game/WaitingModel.vue";
import WinModel from "./../components/Game/WinModel.vue";
import LoseModel from "./../components/Game/LoseModel.vue";
import ScoreBar from "./../components/Game/ScoreBar.vue";
import type { Socket } from "socket.io-client";

export default {
  setup() {
    const gameData = GameData();
    return { gameData };
  },
  components: {
    WaitingModel,
    WinModel,
    LoseModel,
    ScoreBar,
  },
  data() {
    return {
      BallX: 0,
      BallY: 0,
      leftID: 0,
      rightID: 0,
      leftScore: 0,
      rightScore: 0,
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
      mode: '1',
    };
  },

  created() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("resize", this.CanvasResize);
  },

  methods: {
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
          this.drawRect(
            x,
            this.PaddleY * this.Canvas.height,
            this.PaddleWidth,
            this.PaddleHeight,
            "#A33A6F"
          );
          this.drawRect(
            this.Canvas.width - (this.PaddleWidth + x),
            this.OpponentPaddleY * this.Canvas.height,
            this.PaddleWidth,
            this.PaddleHeight,
            "#A33A6F"
          );
        } else if (this.pos == "Right") {
          this.drawRect(
            x,
            this.OpponentPaddleY * this.Canvas.height,
            this.PaddleWidth,
            this.PaddleHeight,
            "#A33A6F"
          );
          this.drawRect(
            this.Canvas.width - (this.PaddleWidth + x),
            this.PaddleY * this.Canvas.height,
            this.PaddleWidth,
            this.PaddleHeight,
            "#A33A6F"
          );
        }
        this.drawBall(
          this.BallX * this.Canvas.width,
          this.BallY * this.Canvas.height,
          this.Canvas.width * 0.01,
          "#A33A6F"
        );
      }
    },

    CanvasResize() {
      if (this.Canvas) {
        this.Canvas.width = window.innerWidth * 0.7;
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
        this.GameSocket.on("updateBall", (data: any) => {
          this.BallX = data.x;
          this.BallY = data.y;
        });

        this.GameSocket.on("OpponentPaddle", (data: any) => {
          this.OpponentPaddleY += data.Paddle;
        });

        this.GameSocket.on("startGame", (data: any) => {
          this.RoomId = data.id;
          this.pos = data.pos;
          this.gameData.phase = 'P';
          this.mode = data.mode;
          if (this.pos === "Left") 
          {
            this.leftID = data.CurrentID;
            this.rightID = data.OpponentID;
          }
          else {
            this.rightID = data.CurrentID;
            this.leftID = data.OpponentID;
          }
          console.log(data)
          console.log("rightID ", this.rightID)
          console.log("leftID ", this.leftID)
        });

        this.GameSocket.on("Score", (data: any) => {
          if (this.pos === "Left") {
            console.log("LEFT SCORE", data);
            this.leftScore = data.Current;
            this.rightScore = data.Oponent;
          }
          else {
            console.log("RIGHT SCORE", data);

            this.rightScore = data.Current;
            this.leftScore = data.Oponent;
          }
        });

        this.GameSocket.on("Lose", (data: any) => {
          this.gameData.phase = 'L';
        });

        this.GameSocket.on("Win", (data: any) => {
          this.gameData.phase = 'N';
          clearInterval(this.intervalId);
        });

        this.GameSocket.on("DeleteRoom", (data: any) => {
          if (this.GameSocket) {
            this.GameSocket.emit("DeleteRoom", {
              roomId: this.RoomId,
            });
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
        console.log("this.gameData.modeLimit: ", this.gameData.modeLimit)
        this.GameSocket.emit("joinRoom", this.gameData.modeLimit);
        // this.mode = this.gameData.modeLimit;
      }
    },

    handleKeyDown(event: any) {
      const keyCode = event.keyCode;
      if (keyCode == 38 && this.PaddleY - 0.04 > 0) {
        this.PaddleY -= 0.04;
        if (this.GameSocket) {
          this.GameSocket.emit("PaddleUpdates", {
            pos: this.pos,
            roomId: this.RoomId,
            Paddle: -0.04,
          });
        }
      } else if (keyCode == 40 && this.PaddleY + 0.25 + 0.02 < 1) {
        this.PaddleY += 0.04;
        if (this.GameSocket) {
          this.GameSocket.emit("PaddleUpdates", {
            pos: this.pos,
            roomId: this.RoomId,
            Paddle: 0.04,
          });
        }
      }
    },
  },
  updated() {
    console.log("New pahse is: ", this.gameData.phase);
    if (this.gameData.phase === 'P' && !this.Canvas) {
      this.Canvas = document.getElementById("gameCanvas") as HTMLCanvasElement | null;
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
        this.loopHook();
      }
    }
  },
  mounted() {
    console.log("mounted ");
    if (this.gameData.phase === 'W')
    {
      this.GameSocket = app.config.globalProperties.$GameSocket;
      this.EventsHandler();
      if (this.gameData.random)
        this.JoinGameEvent();
    }
  },
  unmounted() {
    this.EventsKiller();
    if (this.GameSocket) {
      this.GameSocket.emit("PlayerLeave", {
        roomId: this.RoomId,
        pos: this.pos,
        mode: this.gameData.modeLimit,
      });
    }
    clearInterval(this.intervalId);
    console.log("Unmounted");
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

