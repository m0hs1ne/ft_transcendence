import { io, Socket } from "socket.io-client";

export default (app: any) => {
  const GameSocket: Socket = io("http://localhost:3000/game", {
    withCredentials: true,
  });
  app.config.globalProperties.$GameSocket = GameSocket;
  //console.log("Game Socket Connected", GameSocket);
};
