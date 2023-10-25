<!-- ChatComponent.vue -->
<template>
  <div class="flex flex-col h-full w-full overflow-y-scroll gap-5 px-3 pb-10" ref="scrollContainer">
    <div v-for="message in messages" :key="message.id" class="w-full">
      <div v-if="message.type == 'sent'" class="flex w-full justify-end">
        <div class="flex flex-col items-end">
          <div class="mr-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
            <span>{{ message.text }}</span>
          </div>
          <div class="h-3 w-3 bg-blue-400 rounded-full" />
        </div>
      </div>
      

      <div v-else class="flex w-full">
        <div class="flex flex-col">
          <div class="ml-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
            <span>{{ message.text }}</span>
          </div>
          <div class="h-3 w-3 bg-blue-400 rounded-full" />
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
import { Icon } from "@iconify/vue";



export default {
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  components: {
    Icon,
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      UserProfile: {},
      length: 0
    };
  },
  methods: {
    sendMessage() {
      console.log("I AM SENDmessage function ", this.person);
      if (this.newMessage != '') {
        this.$socket.emit(
          "sendDM",
          { toId: this.person.id, message: this.newMessage },
          () => { },
        );
      }
      this.$nextTick(() => {
        const scrollContainer = this.$refs.scrollContainer;
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
      this.newMessage = "";
    },
  },

  mounted() {
    this.UserProfile = this.person;
    console.log(" I am in Mounted in chatbox ", this.UserProfile)
    this.$socket.emit("getDMMessages", { userId: this.person.id }, () => { });
    this.$socket.on("receiveMessage", (data) => {
      //this.messages.img = data.message.from.avatar
      if (data.type == "DM") {
        var type = "";
        if (data.message.from.id != this.person.id) type = "sent";
        else type = "received";

        this.messages.push({
          // id: Date.now(),
          img: data.message.from.avatar,
          type: type,
          text: data.message.message,
        });

      }
      if (data.type == "DMMessages") {
        data.messages.forEach((element) => {
          var type = "";
          if (element.from.id != this.person.id)
            type = "sent";
          else type = "received";

          this.messages.push({
            // id: Date.now(),
            img: element.from.avatar,
            type: type,
            text: element.message,
          });
        });
      }
      this.$nextTick(() => {
        const scrollContainer = this.$refs.scrollContainer;
        if (scrollContainer)
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });

    });

  },
};
</script>
