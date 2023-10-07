<!-- FriendListComponent.vue -->
<template>
  <button class="flex items-center justify-between text-red-700 hover:text-blue-900" @click="openPopup">
    <span class="mr-2">Add Channel</span>
  </button>
  <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
    <div class="bg-white rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4">Create Channel:</h2>
      <div class="m-2 p-5 rounded-lg bg-slate-300">
        {{ this.friends }}
        <ul class="">
          <li v-for="friend in friends" :key="friend.id" class="flex items-center p-2 space-x-4 border-b">
            <div class="flex-shrink-0">
              <img :src="friend.avatar" @click="handleChatClick(friend)" alt="Avatar" class="h-12 rounded-full" />
              <div class="status text-xs py-1 px-2 rounded-full capitalize" :class="{
                'bg-green-500 text-white': friend.status === 'Online',
                'bg-red-500 text-white': friend.status === 'Offline',
              }">
                {{ friend.status }}
              </div>
            </div>
            <div class="flex-grow">
              <span class="text-lg font-semibold">{{ friend.username }}</span>
              <p class="text-sm text-gray-500">{{ friend.lastmessage }}</p>
            </div>
          </li>
        </ul>
      </div>
      <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Close
      </button>
      <button v-if="selectedOption != '' && ChannelName != ''" @click="SaveChannel"
        class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      friends: [
        {},
        // Add more friend objects here
      ],
    };
  },
  methods: {
    fetchData() {
      this.userStore.fetchChannelById();
      this.userStore.ActiveMessageChannelId.forEach((element) => {
        var tye = "";
        if (element.from.id != element.id) tye = "sent";
        else tye = "received";
        this.messages.push({
          img: element.from.avatar,
          type: tye,
          text: element.message,
        });
      });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
/* Add your CSS styling here */
</style>
