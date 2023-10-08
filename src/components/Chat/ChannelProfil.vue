<!-- FriendListComponent.vue -->
<template>
  <div class="flex flex-col m-2 p-5 h-full rounded-lg  items-center bg-slate-300">
    <div class="flex flex-row">
      <FriendList />
      <button class="flex items-center text-gray-700 hover:text-red-900" @click="LeaveChannel">
        <span class="ml-2 h-10">leave</span>
      </button>
    </div>

    <div class="m-1 p-1 rounded-lg bg-slate-300">

      <ul class="">
        <li v-for="member in members" class="flex items-center p-2 space-x-4 border-b">
          <div class="flex-shrink-0">
            <img :src="member.user.avatar" alt="Avatar" class=" h-8 rounded-full" />
          </div>
          <div class="flex-grow">
            <span class="text-lg font-semibold">{{ member.user.username }}</span>
            <p class="text-sm text-green-700">{{ member.role }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import { useUserStore } from './../../stores/state.ts';
import FriendList from "./FriendList.vue";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      members: [],
      messages: [],
      AddFriend: false
    };
  },
  methods: {
    async fetchData() {
      await this.userStore.fetchChannelById();
      this.members = this.userStore.ActiveMembersChannelId;
      console.log("ChannelData   ", this.members[0].user);
      console.log("ChannelData   ", this.userStore.ActiveMessageChannelId[0]);
    },
    LeaveChannel() {
      console.log(" I am leaving the channel")
      this.$socket.emit("kickMember",
        {
          "memberId": this.userStore.MyId,
          "chatId": this.userStore.ActiveChannelId
        })
   
    }

  },
  mounted() {
    this.fetchData();
  },

  components: { FriendList }
};
</script>
  
<style>
/* Add your CSS styling here */
</style>
  