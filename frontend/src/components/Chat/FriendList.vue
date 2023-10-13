<!-- FriendListComponent.vue -->
<template>
  <button class="flex items-center justify-between 
       text-red-700 hover:text-blue-900" @click="openPopup">
    <span class="mr-2">Invite Friends</span>
  </button>
  <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
    <div class="bg-white rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4">Add friends:</h2>

      <ul class="">
        <li v-for="friend in friends" :key="friend.id" class="flex items-center p-2 space-x-4 border-b">
          <div class="flex-shrink-0">
            <img :src="friend.avatar" alt="Avatar" class="h-12 rounded-full" />
          </div>
          <div class="flex-grow">
            <span class="text-lg font-semibold">{{ friend.username }}</span>
          </div>
          <button @click="sendInvite(friend)"
            class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Invite
          </button>
        </li>
      </ul>

      <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Close
      </button>
      <!-- <button v-if="selectedOption != '' && ChannelName != ''" @click="SaveChannel"
        class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
      </button> -->
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

    };
  },
  methods: {
    async fetchData() {
      await this.userStore.FetchFriend();
      // handl friend 

      this.members = this.userStore.ActiveMembersChannelId;
       console.log("This is Members: " ,this.userStore.UserFriends.data)

      this.userStore.UserFriends.data.forEach(element => {
        // to get friends not found in the channel
        // const foundObject = this.members.find(obj => obj.user.id == element.id);
        // if (!foundObject) {
        //   this.friends.push(element);
        // }
        this.friends.push(element);
      });
    },
    openPopup() {
      this.isOpend = true;
    },
    closePopup() {
      this.isOpend = false;
    },
    sendInvite(friend) {
      console.log(" ActiveChannelId ", this.userStore.ActiveChannelId)
      this.$socket.emit(
        "sendInvite",
        { toId: friend.id, chatId: this.userStore.ActiveChannelId }, () => { },);
      console.log("console ", friend)
      this.isOpend = false;
    }
  },
  mounted() {
    this.fetchData();
  },

};
</script>

<style>
/* Add your CSS styling here */
</style>
