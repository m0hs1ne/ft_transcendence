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
            <img referrerpolicy="no-referrer" :src="friend.fromUser.avatar" alt="Avatar" class="h-12 rounded-full" />
          </div>

          <div class="flex-grow">
            <span class="text-lg font-normal ">{{ friend.fromUser.username }}: invite you to join {{ friend.chatRoom.title
            }} </span>
          </div>
          <img referrerpolicy="no-referrer" @click="AccepteInvite(friend)"
            class="pr-5 m-2 bg-blue-200 h-10 rounded-full hover:bg-green-600 text-white font-bold py-2 px-4"
            src="./../../assets/icons/checkmark.svg">
          <img referrerpolicy="no-referrer" @click="DeclineInvite(friend)"
            class="pr-5 m-2 bg-blue-200 h-10 rounded-full hover:bg-red-600 text-white font-bold py-2 px-4"
            src="./../../assets/icons/cross.svg">
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
      message: '',

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
    AccepteInvite(frien) {
      console.log("This is what is you accept ", frien)

      this.$socket.emit('acceptInvite',
        {
          id: frien.id,
        })
      this.userStore.DmChatroomsList.data.push(frien.chatRoom);
      this.isOpend = false;
      const friendIndex = this.friends.findIndex((friend) => friend.id === frien);
      if (friendIndex !== -1) {
        this.friends.splice(friendIndex, 1);
        console.log("",friendIndex)
      }
    },
    DeclineInvite(friend) {
      this.$socket.emit('Declin',
        {
          id: friend.id,
        })
      console.log(" I am decline this invitation Ask mroin \n");
      

    },
  },
  mounted() {

    this.fetchData();
    this.$socket.on("Notification", (messages) => {
      console.log('Notification popinv ', messages)
      console.log(" This is friends: befor ", this.friends)
      if (messages.type == 'invitation') {
        console.log("The problem of the form of json ")
        this.message = '';
        this.friends.push(messages.invitation)
        // console.log("I am here in once invitation ", messages.invitation)
        //   this.friends.push(messages.invitation)
        //   console.log(" This is friends: " ,this.friends)
        //   console.log(" This is friends: " ,this.friends[0].from.avatar)
      }
      else {
        messages.notifications.forEach((element) => {
          if (element.type == "invitations") {
            console.log("I am invt")
            if (element.invitation.length == 0) {
              this.message = " You don't have any invitation"
            }
            else {
              element.invitation.forEach((invit) => {
                console.log("This is invit: ", invit);
                this.friends.push(invit);
              });
            }
          }
        });
      }
    });
  },

};
</script>
  
<style>
/* Add your CSS styling here */
</style>
  