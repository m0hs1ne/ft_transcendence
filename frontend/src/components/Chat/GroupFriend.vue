<!-- FriendListComponent.vue -->
<template>
    <div class="m-2 p-5 rounded-lg bg-slate-300">
        <AlertChannel/>
          <PopUpinv/>
        <ul class="">
          <li v-for="friend in friends" :key="friend.id"
            class="flex items-center p-2 space-x-4 border-b"
           >
            <div class="flex-shrink-0">
              <img :src="friend.avatar ? friend.avatar :
               'https://cdn1.iconfinder.com/data/icons/developer-set-2/512/users-512.png'" 
                @click="handleChatClick(friend)"  alt="Avatar" class=" h-12 rounded-full" />
            </div>
            <div class="flex-grow">
              <span class="text-lg font-semibold">{{ friend.username }} {{ friend.title }}</span>
              <p class="text-sm text-gray-500">{{ friend.lastmessage }}</p>
            </div>
          </li>
        </ul>
    </div>
  </template>
  
  <script>

  import AlertChannel from "./AlertChannel.vue";
  import PopUpinv from './PopUpinv.vue'
  import axios from "axios";
  import { useUserStore } from './../../stores/state.ts';
  export default {
    components:
    {
      AlertChannel,
      PopUpinv,
    },
    setup() {
      const userStore = useUserStore();
      return { userStore };
    },
    data() {
      return {
        friends: [
          {
          },
        ],
      };
    },
    methods: {
      fetchData() {
        axios
          .get("http://localhost:3000/api/chat-rooms/DM_chatrooms", { withCredentials: true })
          .then((response) => {
            console.log(" i am here fetsh ", response);
            this.friends = response.data;
            console.log(this.friends);
          
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      },
      handleChatClick(Item) {
        // Your click event logic here
        console.log("Prop emitd");
        console.log(Item)
        this.$emit('object-sent', Item);
        this.userStore.UpdateChannelId(Item.id)
      },

      GfetchData() { //http://localhost:3000/api/chat-rooms/my


         console.log(" Noting ")
         this.$socket.on("ChatRoomList",(data)=>{

          console.log("This is data: ",  data)
          if(data.type == 'new')
          {
            console.log("i am new channel");
            console.log(data)
            this.friends.push({
                title: data.chatroom.title,
              });
          }
          
        });
    },
    
    },
    mounted() {
      this.fetchData();
      this.GfetchData();
    },
  };
  </script>
  
  <style>
  /* Add your CSS styling here */
  </style>
      