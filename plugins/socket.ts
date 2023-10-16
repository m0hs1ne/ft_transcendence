
import { io, Socket } from 'socket.io-client';

export default((app) => {
  const socket: Socket = io('http://localhost:3000', {
    withCredentials: true,
  });
  app.config.globalProperties.$socket = socket;
  // app.provide('socket', socket);
  console.log( "Hello i", socket );
});

// export default defineSocketPlugin(nuxtApp =>{
//     const socket: Socket = io('http://localhost:3000',
//     {
//        withCredentials: true
//     });
//     nuxtApp.config.globalProperties.$socket = socket;
//   })
    