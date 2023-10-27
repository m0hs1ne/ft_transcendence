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
      <router-link :to="'/users/' + this.person.id" class="flex w-fit">
        <div class="w-12 bg-gray-200 rounded-full shadow mr-5">
          <img
            :src="this.person.avatar"
            alt="Avatar"
            class="w-12 rounded-full object-cover"
          />
        </div>
        <div class="flex flex-col items-start justify-center">
          <h1 class="font-bold text-lg">
            {{ this.person.username }}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{
              this.person.inGame
                ? "Playing ..."
                : this.person.statusOnline
                ? "Online"
                : "Ofline"
            }}
          </p>
        </div>
      </router-link>
    </div>

    <div class="flex items-center justify-center h-full gap-3">
      <Icon
        v-if="!this.person.inGame && this.person.statusOnline"
        @click="play()"
        title="Play"
        class="text-blue-600 h-10 w-10 ml-3 cursor-pointer hover:bg-blue-200 p-1 rounded-md"
        icon="mingcute:game-2-fill"
      />
      <Icon
        @click="block()"
        title="Block"
        class="text-red-600 h-10 w-10 ml-3 cursor-pointer hover:bg-blue-200 p-1 rounded-md"
        icon="mdi:user-block"
      />
    </div>
  </div>
  <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-700 dark:text-white" />

  <div
    class="flex flex-col h-full w-full overflow-y-scroll gap-5 px-5 py-10 scrollbar-thin scrollbar-thumb-gray-300 scrollba"
    id="messageContainer"
  >
    <div v-for="message in messages" :key="message.id" class="w-full">
      <div v-if="message.type == 'sent'" class="flex w-full justify-end">
        <div class="flex flex-col items-end w-2/3 lg-w-1/3">
          <div class="mr-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
            <span>{{ message.text }}</span>
          </div>
          <div class="flex gap-3">
            <p class="text-gray-500 text-sm mt-1"> You </p>
            <div class="h-3 w-3 bg-blue-400 rounded-full" />
          </div>
        </div>
      </div>

      <div v-else class="flex w-full">
        <div class="flex flex-col w-2/3 lg-w-1/3">
          <div class="ml-2 py-3 px-4 bg-blue-400 rounded-3xl text-white w-fit max-w-md">
            <span>{{ message.text }}</span>
          </div>
          <div class="flex gap-3">
            <div class="h-3 w-3 bg-blue-400 rounded-full" />
            <p class="text-gray-500 text-sm mt-1">{{ message.desc }}</p>
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
import { Icon } from "@iconify/vue";
import GroupFriend from "./GroupFriend.vue";
import { useUserStore } from "./../../stores/state.ts";

export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  components: {
    Icon,
    GroupFriend,
  },
  data() {
    return {
      messages: [],
      newMessage: "",
      UserProfile: {},
      length: 0,
    };
  },
  methods: {
    play() {
      console.log("This is the member of", this.person);
      this.userStore.creatchallenge = true;
      this.userStore.Opponent = this.person;
      console.log(this.person, this.ActiveChannelId);
      console.log(this.$GameSocket);
    },
    Block() {
      console.log(" block user ", this.person);

      axios
        .post(
          "http://localhost:3000/api/users/blocked/",
          {
            id: parseInt(this.person.id),
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    sendMessage() {
      console.log("I AM SENDmessage function ", this.person);
      if (this.newMessage != "") {
        this.$socket.emit(
          "sendDM",
          { toId: this.person.id, message: this.newMessage },
          () => {}
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
    console.log(" I am in Mounted in chatbox ", this.UserProfile);
    this.$socket.emit("getDMMessages", { userId: this.person.id }, () => {});
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
          if (element.from.id != this.person.id) type = "sent";
          else type = "received";

          this.messages.push({
            // id: Date.now(),
            img: element.from.avatar,
            type: type,
            text: element.message,
            desc: element.from.username,
          });
        });
      }
      this.$nextTick(() => {
        const scrollContainer = this.$refs.scrollContainer;
        if (scrollContainer) scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    });
  },
};
</script>
