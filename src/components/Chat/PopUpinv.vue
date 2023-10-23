<!-- FriendListComponent.vue -->
<template>

  <img referrerpolicy="no-referrer" @click="openPopup" title="Check your Inv"
        class=" flex items-center justify-between  h-10 rounded-full  hover:scale-150 text-white font-bold py-2 "
        src="./../../assets/icons/bell.svg">
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
            class="pr-5 m-2 bg-blue-300 h-10 rounded-full hover:bg-green-600 text-white font-bold py-2 px-4"
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
      if(this.friends.length == 0)
        this.message = "You don't have any invitation"
      this.isOpend = true;
    },
    closePopup() {
      this.isOpend = false;
    },
    DeleteFromArray(frien)
    {
      const friendIndex = this.friends.findIndex((friend) => friend.id === frien.id);
      if (friendIndex !== -1) {
        this.friends.splice(friendIndex, 1);
        console.log("",friendIndex)
      }
    },
     AccepteInvite(frien) {
      console.log("This is what is you accept ", frien)

      this.$socket.emit('acceptInvite',
        {
          id: frien.id,
        })
       
     
      //this.userStore.DmChatroomsList.data.push(frien.chatRoom);
  
        console.log(" I am update in pop inv ", this.userStore.DmChatroomsList)
      this.isOpend = false;
      this.DeleteFromArray(frien);
    },
    DeclineInvite(friend) {
      this.$socket.emit('declineInvite',
        {
          id: friend.id,
        })
      console.log(" I am decline this invitation Ask mroin \n");
      this.DeleteFromArray(friend);
      this.isOpend = false;
    },
  },
  mounted() {
    console.log(" I am in");
    this.fetchData();
    this.$socket.on("Notification", (messages) => {
      
      // console.log(" This is friends: befor ", this.friends)
      if (messages.type == 'invitation') {
        console.log("The problem of the form of json ")
        this.message = '';
        this.friends.push(messages.invitation)
        // console.log("I am here in once invitation ", messages.invitation)
        //   this.friends.push(messages.invitation)
        //   console.log(" This is friends: " ,this.friends)
        //   console.log(" This is friends: " ,this.friends[0].from.avatar)
      }
      else if (messages.notifications){
        console.log(messages)
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
  