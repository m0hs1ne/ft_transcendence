<!-- FriendListComponent.vue -->
<template>
  <Icon @click="openPopup" title="Check your Inv" class="h-8 w-8" icon="fluent:alert-20-filled" />
  <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center  custom-box-shadow dark:bg-slate-800">
    <div class="bg-white rounded-lg p-6 dark:bg-slate-900">
      <h2 class="text-xl font-bold mb-4">Invitations:</h2>
      <ul class="">
        {{
          this.message
        }}
        <li v-for="friend in this.friends" :key="friend.id" class="flex items-center p-2 space-x-4 border-b">
          <div class="flex-shrink-0">
            <img referrerpolicy="no-referrer" :src="friend.fromUser.avatar" alt="Avatar" class="h-12 rounded-full" />
          </div>

          <div class="flex-grow">
            <span class="text-lg font-normal">{{ friend.fromUser.username }}: invite you to join
              {{ friend.chatRoom.title }}
            </span>
          </div>
          <img referrerpolicy="no-referrer" @click="AccepteInvite(friend)"
            class="pr-5 m-2 bg-blue-300 h-10 rounded-full hover:bg-green-600 text-white font-bold py-2 px-4"
            src="./../../assets/icons/checkmark.svg" />
          <img referrerpolicy="no-referrer" @click="DeclineInvite(friend)"
            class="pr-5 m-2 bg-blue-200 h-10 rounded-full hover:bg-red-600 text-white font-bold py-2 px-4"
            src="./../../assets/icons/cross.svg" />
        </li>
      </ul>
      <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import axios from "axios";
import { useUserStore } from "./../../stores/state.ts";

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
      message: "",
    };
  },
  components:
  {
    Icon
  },
  methods: {
  
    openPopup() {
      if (this.friends.length == 0) this.message = "You don't have any invitation";
      this.isOpend = true;
    },
    closePopup() {
      this.isOpend = false;
    },
    DeleteFromArray(frien) {
      const friendIndex = this.friends.findIndex((friend) => friend.id === frien.id);
      if (friendIndex !== -1) {
        this.friends.splice(friendIndex, 1);
      }
    },
    AccepteInvite(frien) {
      //console.log("This is what is you accept ", frien);

      this.$socket.emit("acceptInvite", {
        id: frien.id,
      });
      
     //console.log("This is the active: " ,this.userStore.ActiveChannelId);
      this.isOpend = false;
      this.DeleteFromArray(frien);
      //this.userStore.UpdateChannelId(frien.chatRoom.id, frien.chatRoom.title)
    },
    DeclineInvite(friend) {
      this.$socket.emit("declineInvite", {
        id: friend.id,
      });
      this.DeleteFromArray(friend);
      this.isOpend = false;
    },
  },
  async mounted() {
   
    await this.userStore.fetchDataForDmChatRooms()
    this.friends = this.userStore.invitations;
    console.log("Friend +++++++++++++++++", this.userStore.invitations ,this.friends)
    this.$socket.on("Notification", (messages) => {
      //console.log(" This is friends: befor ", this.friends)
      if (messages.type == "invitation") {
       //console.log("The problem of the form of json ");
        this.message = "";
        this.friends.push(messages.invitation);

      } else if (messages.notifications) {
 
        messages.notifications.forEach((element) => {
          if (element.type == "invitations") {
            //console.log("I am invt");
            if (element.invitation.length == 0) {
              this.message = " You don't have any invitation";
            } else {
              element.invitation.forEach((invit) => {
                //console.log("This is invit: ", invit);
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
