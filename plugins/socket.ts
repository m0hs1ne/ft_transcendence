import { io, Socket } from "socket.io-client";

import { io, Socket } from "socket.io-client";

export default (app: any) => {
  const socket: Socket = io("http://10.32.125.38:3000", {
    withCredentials: true,
  });
  app.config.globalProperties.$socket = socket;
  // app.provide('socket', socket);
  console.log("Hello i", socket);
};

// export default defineSocketPlugin(nuxtApp =>{
//     const socket: Socket = io('http://10.32.125.38:3000',
//     {
//        withCredentials: true
//     });
//     nuxtApp.config.globalProperties.$socket = socket;
//   })
