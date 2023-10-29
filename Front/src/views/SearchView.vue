<script>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import axios from "axios";
import { useUserStore, SharedData } from "./../stores/state.ts";


export default {
  setup() {
    const isError = ref(false);
    const state = SharedData();
    const chatApi = useUserStore();
    return { chatApi, state, isError };
  },
  data() {
    return {
      query: "",
      pass: "",
      error: "",
      results: {},
      users: {},
      channels: {},
      selectedChannel: {},
      userTab: ref(true),
      joinChannel: ref(false),
    };
  },
  components: {
    Icon,
  },
  methods: {
    async search(event) {
      this.isError = false;

      console.log("new query: ", this.query);
      if (!this.query)
        return;
      try {
        const response = await axios.post(
          "http://localhost:3000/api/users/search",
          {
            query: this.query,
          },
          {
            withCredentials: true,
          }
        );
        console.log("Search response", response.data);
        this.results = response.data;
        this.users = response.data.users;
        this.channels = response.data.chatrooms;
      } catch (error) {
        console.error("Error searching users:", error);
        this.isError = true;
      }
    },

    async channelLogic(channel) {
      console.log("channelLogic channel: ", channel);
      if (channel.isMember) {
        this.chatApi.ActiveId = channel;
        this.$router.push('/chat');
        return;
      }
      if (channel.privacy === "protected" && !this.joinChannel) {
        this.joinChannel = true;
        this.selectedChannel = channel;
        this.pass = "";
        return;
      }
      try {
        this.$socket.emit(
          "enterChat",
          {
            chatId: channel.id,
          },
          () => { }
        );
        this.$socket.on("receiveMessage", (data) => {
          console.log(data);
        });
      } catch (error) {
        console.error("channelLogic error", error);
      }
    },

    async protectedChannel() {
      if (!this.pass)
        return;
      this.error = "";
      try {
        this.$socket.emit(
          "enterChat",
          {
            chatId: this.selectedChannel.id,
            password: this.pass,
          },
          () => { }
        );
        this.$socket.on("receiveMessage", (data) => {
          if (data.action == "joined") {
            this.chatApi.ActiveId = this.selectedChannel;
            this.$router.push('/chat');
            return;
          }
        });
        this.error = "Wrong password!!"
      } catch (error) {
        this.error = "Something went wrong, please try again!!";
        console.error("channelLogic error", error);
      }
    },
  },
};
</script>

<template>
  <div v-if="this.isError" class="flex ml-20 lg:ml-24 items-center justify-center h-screen dark:bg-slate-800 p-10">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Opps!!</h1>
      <p class="text-lg text-gray-600 mt-4 mx-20 lg:mx-40 dark:text-gray-400">
        Something went wrong. feel free to contact us if the problem presists.
      </p>
      <div class="flex gap-5 items-center justify-center w-full">
        <button @click="this.$router.push('/')" class="mt-8 text-blue-500 hover:underline text-lg">Go to Home</button>
        <button @click="this.$router.go(-1)" class="mt-8 text-blue-500 hover:underline text-lg">Go Back</button>
        <button @click="this.isError = false" class="mt-8 text-blue-500 hover:underline text-lg">Refresh</button>
      </div>
    </div>
  </div>
  <div v-else-if="this.joinChannel"
    class="flex flex-col justify-center items-center min-h-screen ml-20 lg:ml-24 dark:bg-slate-800">
    <div
      class="flex flex-col gap-5 items-center justify-center w-4/5 md:w-[500px] rounded-2xl custom-box-shadow dark:bg-slate-900">
      <div class="flex w-full justify-start items-center pl-10 pt-7  font-bold text-2xl dark:text-white">
        Join {{ this.selectedChannel.title }}
      </div>
      <div class="w-full px-10 pt-5">
        <input type="text"
          class=" font-bold bg-gray-200 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
          v-model="this.pass" placeholder="Enter Channel password" @input="this.error = ''" required />
      </div>
      <p class="text-red-500">
        {{ this.error }}
      </p>
      <div class="flex w-full justify-end items-center  font-bold pr-10 pb-5 gap-5">
        <button @click="this.protectedChannel"
          class="text-gray-100 dark:text-white shadow py-2 px-5 bg-blue-500 rounded-lg">
          Join
        </button>
        <button @click="this.joinChannel = false"
          class="dark:text-white shadow py-2 px-5 bg-gray-400 dark:bg-slate-700 rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col justify-start items-center min-h-screen ml-20 lg:ml-24 dark:bg-slate-800">
    <div class="w-full flex flex-col justify-center items-center px-10">
      <div class="w-full max-w-[400px] py-5">
        <input type="text"
          class=" font-bold text-xl bg-gray-200 text-gray-900 rounded-lg w-full px-8 py-4 dark:bg-gray-700 dark:text-white"
          @input="this.search" v-model="this.query" placeholder="Search" required />
      </div>
      <div class="flex items-center justify-evenly w-full max-w-[500px] my-2 px-5 dark:text-white">
        <button @click="this.userTab = true" class="flex flex-col p-3 gap-0.5 items-center">
          <h1 class=" font-bold text-xl">Users</h1>
          <div v-if="this.userTab" class="w-12 h-3 px-5 rounded-md bg-blue-600 custom-box-shadow" />
          <div v-else class="w-12 h-3 px-5" />
        </button>
        <button @click="this.userTab = false" class="flex flex-col p-3 gap-0.5 items-center">
          <h1 class=" font-bold text-xl">Channels</h1>
          <div v-if="!this.userTab" class="w-12 h-3 px-5 rounded-md bg-blue-600 custom-box-shadow" />
          <div v-else class="w-12 h-3 px-5" />
        </button>
      </div>
      <hr class="w-full max-w-[500px] my-2 px-5 h-px bg-gray-200 border-0 dark:bg-gray-700 dark:text-white" />

      <div v-if="this.userTab && !this.users.length" class="h-full flex flex-col items-center">
        <img src="../assets/imgs/empty2.png" alt="" class=" aspect-square object-cover">
        <p class="font-bold text-gray-400 text-2xl pb-20 md:pb-0 text-center">
          {{ this.query ? "There is no results for that" : "Search for users!!" }}
        </p>
      </div>
      <div v-else-if="this.userTab" v-for="(player, index) in this.users"
        class="flex items-center justify-start w-full max-w-[500px] my-2 px-5 py-3 rounded-2xl custom-box-shadow dark:bg-slate-700 dark:text-white">
        <router-link :to="'/users/' + player.id" class="flex items-center justify-between min-w-full">
          <div class="flex items-center">
            <div class="w-12 h-12 md:w-20 md:h-20 bg-gray-300 rounded-full shadow mr-2 md:mr-4">
              <img referrerpolicy="no-referrer" :src="player.avatar" alt="Avatar"
                class="aspect-square object-cover rounded-full w-12 h-12 md:w-20 md:h-20" />
            </div>
            <p
              class="w-32 md:w-56 overflow-ellipsis line-clamp-1  font-semibold md:text-xl tracking-wide dark:text-white">
              {{ player.username }}
            </p>
          </div>
          <p class="min-w-fit  font-semibold text-xl md:text-2xl tracking-wide dark:text-white">
            {{ parseInt((player.wins / (player.wins + player.losses)) * 100) }}%
          </p>
        </router-link>
      </div>

      <div v-if="!this.userTab && !this.channels.length" class="h-full flex flex-col items-center">
        <img src="../assets/imgs/empty2.png" alt="" class=" aspect-square object-cover">
        <p class="font-bold text-gray-400 text-2xl pb-20 md:pb-0 text-center">
          {{ this.query ? "There is no results for that!!" : "Search for channels!!" }}
        </p>
      </div>
      <div v-else-if="!this.userTab" v-for="(channel, index) in this.channels"
        class="flex items-center justify-start w-full max-w-[500px] my-2 px-5 py-3 rounded-2xl custom-box-shadow dark:bg-slate-700 dark:text-white">
        <div class="flex items-center justify-between min-w-full">
          <div class="flex items-center">
            <div class="w-12 h-12 md:w-20 md:h-20 bg-gray-200 rounded-full shadow mr-2 md:mr-4">
              <Icon class="text-blue-600 w-full h-full" icon="clarity:group-solid" />
            </div>
            <p
              class="w-32 md:w-56 overflow-ellipsis line-clamp-1  font-semibold md:text-xl tracking-wide dark:text-white">
              {{ channel.title }}
            </p>
          </div>
          <button @click="this.channelLogic(channel)"
            class="text-gray-100 dark:text-white  font-bold shadow py-2 px-5 bg-blue-500 rounded-lg">
            {{ channel.isMember ? "Chat" : "Join" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
