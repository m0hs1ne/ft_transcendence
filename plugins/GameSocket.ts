import { io, Socket } from 'socket.io-client';

export default((app: any) => {
  const GameSocket: Socket = io('http://10.32.125.38:3000/game', {
    withCredentials: true,
  });
  app.config.globalProperties.$GameSocket = GameSocket;
  console.log( "Game Socket Connected", GameSocket);
});