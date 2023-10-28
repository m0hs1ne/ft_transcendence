<!-- ChatComponent.vue -->
<template>
  <div
    class="flex items-center justify-between w-full rounded-2xl bg-transparent px-5 py-3"
  >
    <div class="flex w-fit items-center">
      <Icon
        v-if="this.userStore.screenWidth < 768"
        class="w-8 h-8 cursor-pointer mr-5"
        icon="ion:arrow-back"
        @click="this.userStore.viewMode = 'List'"
      />
      <div class="w-12 bg-slate-200 rounded-full shadow mr-5">
        <Icon class="text-blue-600 w-12 h-12" icon="clarity:group-solid" />
      </div>
      <div class="flex flex-col items-start justify-center">
        <h1 class="font-bold text-lg">
          {{ this.channel.title }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ this.channel.privacy }}
        </p>
      </div>
    </div>

    <Icon
      @click="this.userStore.viewMode = 'Channel'"
      title="Channel Setting"
      class="text-blue-500 h-10 w-10 ml-3 cursor-pointer hover:bg-blue-100 p-1 rounded-md"
      icon="mingcute:settings-3-fill"
    />
  </div>
  <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-700 dark:text-white" />

  <div
    class="flex flex-col w-full h-full overflow-y-scroll gap-5 px-5 py-10"
    ref="scrollContainer1"
  >
    <div v-for="message in this.messages" class="w-full">
      <div
        v-if="message.type == 'notification'"
        class="flex flex-row justify-center rounded text-blue-900"
      >
        <span>{{ message.message }}</span>
      </div>

      <div v-if="message.type == 'message'" class="flex mb-4">
        <div
          v-if="message.from.id == this.userStore.MyId"
          class="flex w-full justify-end"
        >
          <div class="flex flex-col items-end">
            <div class="mr-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
              <span>{{ message.message }}</span>
            </div>
            <div class="flex gap-3">
              <p class="text-gray-500 text-sm mt-1"> You </p>
              <div class="h-3 w-3 bg-blue-400 rounded-full" />
            </div>
          </div>
        </div>

        <div v-else class="flex w-full">
          <div class="flex flex-col">
            <div class="mr-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
              <span>{{ message.message }}</span>
            </div>
            <div class="flex gap-3">
              <div class="h-3 w-3 bg-blue-400 rounded-full" />
              <p class="text-gray-500 text-sm mt-1">{{ message.from.username }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="flex gap-3 items-center justify-center w-full rounded-2xl custom-box-shado bg-transparent p-7"
  >
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type your message here..."
      class="placeholder:font-light bg-gray-200 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
    />

    <div
      class="flex justify-center items-center h-full text-white dark:text-white shadow px-2 bg-blue-500 rounded-lg"
    >
      <Icon @click="sendMessage()" icon="mingcute:send-fill" height="30" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "./../../stores/state.ts";
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const userStore = useUserStore();

    return { userStore };
  },

  data() {
    return {
      messages: [{}],
      newMessage: "",
      UserProfile: {},
      length: 0,
      members: {},
      settingTab: false,
    };
  },
  methods: {
    sendMessage() {
      console.log("I AM SENDmessage channel");
      if (this.newMessage != "") {
        this.$socket.emit(
          "sendMessage",
          { chatId: this.channel.id, message: this.newMessage },
          () => {}
        );
      }

      this.$nextTick(() => {
        const scrollContainer = this.$refs.scrollContainer1;
        if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
      this.newMessage = "";
    },
  },

  async mounted() {
    console.log("ppppp pp " ,this.userStore.ActiveChannelId);

    await this.userStore.fetchChannelById();
    this.messages = this.userStore.ActiveMessageChannelId;
    
    this.$socket.on("receiveMessage", (data) => {
      // console.log( " merwan ",data.chatRoomId)
      console.log("Helllo this is my ", this.userStore.ActiveChannelId, data.chatRoomId);
      if (
        (this.userStore.ActiveChannelId == data.chatRoomId &&
          data.type == "notification" &&
          data.action == "joined") ||
        (data.type == "notification" && data.action == "status") ||
        (data.type == "message" && data.action == "message")
      ) {
        this.messages.push(data);
      }

      if (
        this.userStore.ActiveChannelId == data.chatRoomId &&
        data.type == "notification" &&
        data.action == "kick"
      )
        this.messages.push(data);
    });
    //this.userStore.fetchChannelById();
    // this.$nextTick(() => {
    //   console.log(" scrol ")
    //   const scrollContainer = this.$refs.scrollContainer;
    //   scrollContainer.scrollTop = scrollContainer.scrollHeight;
    // });
  },
};
</script>
