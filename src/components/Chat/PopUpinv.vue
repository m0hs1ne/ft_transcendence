<!-- FriendListComponent.vue -->
<template>
    <button class="flex items-center justify-between 
         text-red-700 hover:text-blue-900" @click="openPopup">
      <span class="mr-2">Invitations</span>
    </button>
    <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
      <div class="bg-white rounded-lg p-6">
        <h2 class="text-xl font-bold mb-4">Invitations:</h2>
        <ul class="">{{ this.message }}
          <li v-for="friend in friends" :key="friend.id" class="flex items-center p-2 space-x-4 border-b">
            <div class="flex-shrink-0">
              <img :src="friend.fromUser.avatar" alt="Avatar" class="h-12 rounded-full" />
            </div>
            <div class="flex-grow">
              <span class="text-lg font-normal ">{{ friend.fromUser.username }}: invite you to join {{ friend.chatRoom.title }} </span>
            </div>
            <button @click="AccepteInvite(friend)"
              class="m-2 bg-blue-500 h-10 rounded-full hover:bg-blue-700 text-white font-bold py-2 px-4">
              Accepte
            </button>
            <button @click="DeclineInvite(friend)"
              class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 h-10 rounded-full">
              Decline
            </button>
          </li>
        </ul>
        <button @click="closePopup" class="m-2  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useUserStore } from './../../stores/state.ts';
  export default {
    setup() {
      const userStore = useUserStore();
      return { userStore };
    },
    data() {
      return {
        isOpend: false,
        friends: [],
        members: [],
        message:'',
  
      };
    },
    methods: {
      async fetchData() {
       
      },
      openPopup() {
        this.isOpend = true;
      },
      closePopup() {
        this.isOpend = false;
      },
      AccepteInvite(friend)
      {
        console.log("This is what is you accept " ,friend)

        this.$socket.emit('acceptInvite',
        {
          id:friend.id,
        })
        this.isOpend = false;
      },
      DeclineInvite(friend)
      {
        console.log(" I am decline this invitation Ask mroin \n");
      },
    },
    mounted() {
      this.fetchData();
      this.$socket.on("Notification", (messages) => {
        messages.notifications.forEach((element) => {
          if (element.type == "invitations") {
            if(element.invitation.length == 0)
            {
              this.message = " You don't have invitation"
            }
            else
            {
              element.invitation.forEach((invit)=>{
                console.log("This is invit: " ,invit);
                this.friends.push(invit); 
              });
            }
          }
        });
      });
    },
  
  };
  </script>
  
  <style>
  /* Add your CSS styling here */
  </style>
  