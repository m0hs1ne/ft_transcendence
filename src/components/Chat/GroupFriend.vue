<!-- FriendListComponent.vue -->
<template>
    <div class="m-2 p-5 rounded-lg bg-slate-300">
        <AlertChannel/>
        <ul class="">
          <li v-for="friend in friends" :key="friend.id"
            class="flex items-center p-2 space-x-4 border-b"
           >
            <div class="flex-shrink-0">
              <img :src="friend.avatar ? friend.avatar : 'https://cdn1.iconfinder.com/data/icons/developer-set-2/512/users-512.png'"  @click="handleChatClick(friend)"  alt="Avatar" class=" h-12 rounded-full" />
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
  import axios from "axios";
  export default {
    components:
    {
      AlertChannel,
    },
    data() {
      return {
        friends: [
          {
          },
          // Add more friend objects here
        ],
      };
    },
    methods: {
      fetchData() {
        axios
          .get("http://localhost:3000/api/users/friends/", { withCredentials: true })
          .then((response) => {
            console.log(" i am here fetsh ", response);
            this.responseData = response.data;
            this.friends = this.responseData.friends
            console.log(this.friends)
  
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
          
        
      },
      handleChatClick(Item) {
        // Your click event logic here
        console.log("Prop emitd ");
        // console.log(Item)
        this.$emit('object-sent', Item);
      },

      GfetchData() {
         this.$socket.emit("findAllChatRooms", {}, () => {});
          this.$socket.on("ChatRoomList",(data)=>{
          console.log( "This is length",this.friends.length)
          if(data.type == 'new')
          {
            console.log("i am new channel");
            console.log(data)
            this.friends.push({
                title: data.chatroom.title,
              });
          }
          if(data.type == 'all')
          {

            data.chatrooms.forEach((element) => {
              this.friends.push({
                // id: Date.now(),
                title: element.title,
                id:element.id,
              });
            });
          }
        });
        console.log( "This is length",this.friends.length)
    },
    
    },
    mounted() {
      this.GfetchData();
      this.fetchData();
    },
  };
  </script>
  
  <style>
  /* Add your CSS styling here */
  </style>
      