<!-- ChatComponent.vue -->
<template>

<!-- <div class="avatar-container mx-auto mr-2 flex items-center space-x-4 rounded-lg">
    <img :src="person.avatar" alt="Avatar" class="circle avatar" />
    <span>{{ person.username }}</span>
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">block</button>
  </div> -->
  <div class="px-5">
    <div class=" flex flex-col mt-5 max-h-[32rem] overflow-y-scroll">
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
    <div class="relative w-full">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type your message here..."
        class="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
      />
      <button class="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600" @click="sendMessage()">Send</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  watch: {
    '$props': {
      handler(newProps, oldProps) {
        if (newProps.person.id !== oldProps.person.id) {
          // ID has changed, perform re-render or any other actions
          console.log('ID changed:');
          // Call any methods or perform additional logic here
        }
      }
    }
  },
  data() {
    return {
      messages: [
        // Initialize with some sample messages (optional)
      ],
      newMessage: "",
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
           this.newMessage = "";
      
    },
  },

  mounted() {
    console.log(" I am in Mounted ")
    this.$socket.emit("getDMMessages", { userId: this.person.id }, () => {});
    this.$socket.on("receiveMessage", (data) => {
      //this.messages.img = data.message.from.avatar
      console.log("This is my data: ", data);
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
          if (element.from.id != this.person.id) tye = "sent";
          else tye = "received";

          this.messages.push({
            // id: Date.now(),
            img: element.from.avatar,
            type: tye,
            text: element.message,
          });
        });
      }
  
    });
  },
};
</script>

<style>
/* Add your own CSS styling here */

/* .avatar-container {
  display: flex;
  direction: center;
  margin-right: 10px;
} */

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
