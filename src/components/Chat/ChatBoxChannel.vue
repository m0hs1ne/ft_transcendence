<!-- ChatComponent.vue -->
<template>
  <div class="flex flex-col w-full h-full overflow-y-scroll gap-5 px-3" ref="scrollContainer1">
    <div v-for="message in this.messages" class="w-full pb-10">
      <div v-if="message.type == 'notification'" class="flex flex-row justify-center rounded text-blue-900">
        <span>{{ message.message }}</span>
      </div>

      <div v-if="message.type == 'message'" class="flex mb-4">
        <div v-if="message.from.id == this.userStore.MyId" class="flex w-full justify-end">
        <div class="flex flex-col items-end">
          <div class="mr-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
            <span>{{ message.message }}</span>
          </div>
          <div class="h-3 w-3 bg-blue-400 rounded-full" />
        </div>
      </div>

      <div v-else class="flex w-full">
        <div class="flex flex-col">
          <div class="mr-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
            <span>{{ message.message }}</span>
          </div>
          <div class="h-3 w-3 bg-blue-400 rounded-full" />
        </div>
      </div>
      </div>
    </div>
  </div>

  <div class="flex gap-3 items-center justify-center w-full rounded-2xl custom-box-shado bg-transparent px-3">
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message here..."
      class="placeholder:font-light bg-gray-200 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white" />

    <div class="flex justify-center items-center h-full text-white dark:text-white shadow px-2 bg-blue-500 rounded-lg">
      <Icon @click="sendMessage()" icon="mingcute:send-fill" height="30" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "./../../stores/state.ts";
import { Icon } from "@iconify/vue";

export default {
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },

  components: {
    Icon,
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
      b: false,
    };
  },
  methods: {
    sendMessage() {
      console.log("I AM SENDmessage channel");
      if (this.newMessage != "") {
        this.$socket.emit(
          "sendMessage",
          { chatId: this.channel.id, message: this.newMessage },
          () => { }
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
    console.log(this.userStore.ActiveChannelId);
    await this.userStore.fetchChannelById();
    this.messages = this.userStore.ActiveMessageChannelId;
    // console.log("messs", this.messages)
    //this.userStore.UpdateChannelId(this.channel.id)
    // console.log("I am in mounted", this.userStore.ActiveChannelId)
    this.$socket.on("receiveMessage", (data) => {
      // console.log( " merwan ",data.chatRoomId)
      console.log("Helllo this is my ", this.userStore.ActiveChannelId, data.chatRoomId);
      if (
        this.userStore.ActiveChannelId == data.chatRoomId &&
        ((data.type == "notification" && data.action == "joined") ||
          (data.type == "notification" && data.action == "status") ||
          (data.type == "message" && data.action == "message"))
      ) {
        this.messages.push(data);
      }
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

<style>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.chat-container {
  border: 1px solid #ccc;
  /* display: flex; */
  flex-direction: column;
  border-radius: 8px;
  height: 95%;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  padding: 10px;
  /* justify-content: flex-end; */
  overflow-y: scroll;
  height: 500px;
}

.message {
  margin: 5px;
  padding: 10px;
  border-radius: 8px;
  word-break: break-word;
  max-width: 70%;
}

.message-time {
  display: flex-end;
  font-size: 12px;
  color: #17e484;
}

.received {
  align-self: flex-start;
}

.sent {
  align-self: flex-end;
}

.notification {
  align-self: center;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
}

.chat-input input {
  flex: 1;
  padding: 5px;
}

.chat-input button {
  margin-left: 10px;
}
</style>
