
import { io, Socket } from 'socket.io-client';

export default defineNuxtPlugin((app) => {
  const socket: Socket = io('http://localhost:3000', {
    withCredentials: true,
  });

  app.provide('socket', socket);
});

// export default defineSocketPlugin(nuxtApp =>{
//     const socket: Socket = io('http://localhost:3000',
//     {
//        withCredentials: true
//     });
//     nuxtApp.config.globalProperties.$socket = socket;
//   })
    