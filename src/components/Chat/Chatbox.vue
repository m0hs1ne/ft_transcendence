<!-- ChatComponent.vue -->
<template>
  <div class=" flex flex-col justify-between h-screen">
    <div class=" flex flex-col mt-5 overflow-y-scroll" ref="scrollContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{
          message: true,
          received: message.type === 'received',
          sent: message.type === 'sent',
        }"
      >
        <div class="flex mb-4">
          <img :src="message.img" alt="Avatar" class="circle avatar mr-1 " />
          <div class="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">  
            <span>{{ message.text }}</span>
          </div>
        </div>
        <!-- <div class = "message-time">00:00</div> -->
      </div>
    </div>
    <div class="flex ">
      <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type your message here..."
      class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
      />
      <button class="flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600" @click="sendMessage()">Send</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
  import { useUserStore } from './../../stores/state.js';
export default {
  props: {
    person: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      messages: [],
      newMessage: "",
      UserProfile:{},
      length:0
    };
  },
  methods: {
    sendMessage() {
        console.log("I AM SENDmessage function ", this.person);
        this.$socket.emit(
          "sendDM",
          { toId: this.person.id, message: this.newMessage },
          () => {},
        );
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
    this.$socket.emit("getDMMessages", { userId: this.person.id }, () => {});
    this.$socket.on("receiveMessage", (data) => {
      //this.messages.img = data.message.from.avatar
      if(data.type == "DM")
      {
        var tye = "";
        if (data.message.from.id != this.person.id) tye = "sent";
        else tye = "received";

        this.messages.push({
          // id: Date.now(),
          img: data.message.from.avatar,
          type: tye,
          text: data.message.message,
        });
        
      }
      if (data.type == "DMMessages") {
        data.messages.forEach((element) => {
          var tye = "";
          if (element.from.id != this.person.id)
            tye = "sent";
          else tye = "received";

          this.messages.push({
            // id: Date.now(),
            img: element.from.avatar,
            type: tye,
            text: element.message,
          });
        });
      }
      this.$nextTick(() =>{
          const scrollContainer = this.$refs.scrollContainer;
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        });
  
    });

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
