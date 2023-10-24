<!-- ChatComponent.vue -->
<template>
  <div class=" flex flex-col justify-between h-screen">
    <div class=" flex flex-col mt-5 overflow-x-hidden overflow-y-scroll" ref="scrollContainer1">
      <div v-for="message in this.messages" class="min-w-full  max-w-2xl">
        <div v-if="message.type == 'notification'" class="flex flex-row justify-center rounded text-blue-900">
          <span>{{ message.message }}</span>
        </div>

        <div v-if="message.type == 'message'" class="flex mb-4">
          <img referrerpolicy="no-referrer" :src="message.from.avatar" alt="Avatar" class="circle avatar mr-1 " />
          <div v-if="message.from.id == this.userStore.MyId"
            class="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
            <span>{{ message.message }}</span>
          </div>
          <div v-if="message.from.id != this.userStore.MyId"
            class="mr-2 py-3 px-4 bg-red-400  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
            <span>{{ message.message }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex ">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message here..."
        class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
      <button class="flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
        @click="sendMessage()">Send</button>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from './../../stores/state.ts';
export default {

  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const userStore = useUserStore();

    return { userStore }
  },

  data() {
    return {
      messages: [{}],
      newMessage: "",
      UserProfile: {},
      length: 0,
      members: {},
      b: false
    };
  },
  methods: {
    sendMessage() {
      console.log("I AM SENDmessage channel");
      if (this.newMessage != '') {
        this.$socket.emit(
          "sendMessage",
          { chatId: this.channel.id, message: this.newMessage },
          () => { },
        );
      }

      this.$nextTick(() => {
        const scrollContainer = this.$refs.scrollContainer1;
        if (scrollContainer)
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
      this.newMessage = "";
    },
  },

  async mounted() {
    await this.userStore.fetchChannelById();
    this.messages = this.userStore.ActiveMessageChannelId;
    //this.userStore.UpdateChannelId(this.channel.id)
    console.log("I am in mounted", this.userStore.ActiveChannelId)
    this.$socket.on("receiveMessage", (data) => {

      if ((data.type == 'notification' && data.action == 'joined') ||
        (data.type == 'notification' && data.action == 'status') ||
        (data.type == 'message' && data.action == 'message')) {
        console.log(" I am puching .....", data)
        this.messages.push(data);
      }

    },);
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
