<!-- FriendListComponent.vue -->
<template>
  <div class=" flex flex-col m-2 p-5 rounded-lg bg-slate-300   h-full flex-shrink-0 ">
    <!-- {{ this.userStore.DmChatroomsList }} -->

    <AlertChannel />
    <PopUpinv />
    <ul>
      <li v-for="friend in this.userStore.DmChatroomsList" :key="friend.id"
        class="flex items-center p-2 space-x-4 border-b">
        <div class="flex-shrink-0">
          <img :src="friend.avatar ? friend.avatar :
            'https://cdn1.iconfinder.com/data/icons/developer-set-2/512/users-512.png'"
            @click="handleChatClick(friend)" alt="Avatar" class=" h-12 rounded-full" />
        </div>
        <div class="flex-row">
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
      ],
    };
  },
  methods: {
    async fetchData() {

      await this.userStore.fetchDataForDmChatRooms();
      console.log(" OLO ", this.userStore.DmChatroomsList)
      if (this.userStore.DmChatroomsList.length == 0 || this.userStore.DmChatroomsList.data == 0)
        this.message = " 5liha 3la allah ";
      else {
        console.log(" this.userStore.DmChatroomsList ", this.userStore.DmChatroomsList)
        this.friends = this.userStore.DmChatroomsList.data;
      }
    },
    handleChatClick(Item) {
      // Your click event logic here
      console.log("Prop emitd");
      console.log(Item)
      this.$emit('object-sent', Item);
      this.userStore.UpdateChannelId(Item.id, Item.title)
    },

    async SocketNoti() {
      // console.log(" Noting ")
      // await this.userStore.fetchDataForDmChatRooms();
      await this.$socket.on("ChatRoomList", (data) => {
        console.log("This is data: ", data)
        if (data.type == 'new' || data.type == 'updated') {
          this.userStore.fetchDataForDmChatRooms();
        }
        if (data.type == 'remove') {
          this.userStore.fetchDataForDmChatRooms();
          if (this.userStore.DmChatroomsList.length != 0)
            this.handleChatClick(this.userStore.DmChatroomsList[0])
        }}
      );
      
      if(this.userStore.ActiveId.length)
      {
        console.log(" I am her to get chat room ", this.userStore.ActiveId)
        this.handleChatClick(this.userStore.ActiveId)
      }
      else if (this.userStore.DmChatroomsList.length != 0)
      {
        console.log(" I am her ",this.userStore.DmChatroomsList);
        this.handleChatClick(this.userStore.DmChatroomsList[0])
      }
    },
    sideMunue() { }
  },

  async mounted() {
  await this.fetchData();
   await  this.SocketNoti();

    this.$socket.on("receiveMessage", (data) => {
      console.log(" receiveMessage form Group Friend ********* ", data)
      if ((data.type == 'notification' && data.action == 'joined') ||
        (data.type == 'notification' && data.action == 'status') ||
        (data.type == 'notification' && data.action == 'kick')
      ) {
        this.fetchData();
      }
      if ((data.type == 'notification' && data.action == 'kick')) {
        this.fetchData();
        this.SocketNoti();
      }

    },);

    this.$socket.on("userStatus", (data) => {
      console.log(" receiveMessage  user Status  ********* ", data)
      

    },);
     




  },
};
</script>
  
<style>
/* Add your CSS styling here */
</style>
      