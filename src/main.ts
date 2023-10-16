import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import myPlugin from './../plugins/socket.ts'
import GameSocket from './../plugins/GameSocket.ts'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(myPlugin)
app.use(GameSocket)


app.mount('#app')
