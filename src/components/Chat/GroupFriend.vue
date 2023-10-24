<!-- FriendListComponent.vue -->
<template>
  <div id="sidebar"
    class="flex flex-col w-1/4 bg-gray-400 dark:bg-slate-900 p-5 custom-box-shadow dark:text-white rounded-xl">
    <div class="flex w-full flex-row dark:text-white pb-5 justify-evenly">
      <Icon @click="moveTheBar()" title="moveTheBar" class="h-8 w-8" icon="mingcute:menu-fill" />
      <AlertChannel />
      <PopUpinv />
    </div>

    <ul>
      <li v-for="friend in this.userStore.DmChatroomsList" :key="friend.id" @click="handleChatClick(friend)"
        class="flex w-full items-center p-2 cursor-pointer custom-box-shadow rounded-xl dark:bg-slate-800 mb-3">
        <div class="flex w-full">
          <div class="w-14 h-14 bg-gray-200 rounded-full shadow mr-4">
            <img v-if="friend.avatar" :src="friend.avatar" alt="Avatar" :class="getStatusClass(friend.statusOnline)"
              class="h-14 w-14 rounded-full object-cover" />
            <Icon v-else class="text-blue-600 h-14 w-14" icon="clarity:group-solid" />
          </div>
          <GameMode v-if="this.userStore.creatchallenge" />
          <div v-if="show" class="flex items-center">
            <span class="text-lg font-bold overflow-ellipsis line-clamp-1">{{ friend.username }} {{ friend.title
            }}</span>
            <p class="text-sm text-gray-500">{{ friend.lastmessage }}</p>
          </div>
        </div>
        <Icon v-if="friend.inGame == false && friend.statusOnline == true" @click="play(friend)" title="Play"
          class="text-blue-600 h-10 w-10 ml-3" icon="mingcute:game-2-fill" />
      </li>
    </ul>
  </div>
</template>

<script>
import AlertChannel from "./AlertChannel.vue";
import PopUpinv from "./PopUpinv.vue";
import axios from "axios";
import { useUserStore } from "./../../stores/state.ts";
import GameMode from "./GameMode.vue";
import { Icon } from "@iconify/vue";

export default {
  components: {
    AlertChannel,
    PopUpinv,
    GameMode,
    Icon,
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      friends: [],
      show: true,
    };
  },
  methods: {
    async fetchData() {
      await this.userStore.fetchDataForDmChatRooms();
      console.log(" OLO ", this.userStore.DmChatroomsList);
      if (
        this.userStore.DmChatroomsList.length == 0 ||
        this.userStore.DmChatroomsList.data == 0
      )
        this.message = " 5liha 3la allah ";
      else {
        console.log(" this.userStore.DmChatroomsList ", this.userStore.DmChatroomsList);
        this.friends = this.userStore.DmChatroomsList.data;
      }
    },
    handleChatClick(Item) {
      // Your click event logic here
      console.log("Prop emitd");
      console.log(Item);
      this.$emit("object-sent", Item);
      this.userStore.UpdateChannelId(Item.id, Item.title);
    },

    async SocketNoti() {
      // console.log(" Noting ")
      // await this.userStore.fetchDataForDmChatRooms();
      await this.$socket.on("ChatRoomList", (data) => {
        console.log("This is data: ", data);
        if (data.type == "new" || data.type == "updated") {
          this.userStore.fetchDataForDmChatRooms();
        }
        if (data.type == "remove") {
          this.userStore.fetchDataForDmChatRooms();
          if (this.userStore.DmChatroomsList.length != 0)
            this.handleChatClick(this.userStore.DmChatroomsList[0]);
        }
      });

      if (this.userStore.ActiveId.length) {
        console.log(" I am her to get chat room ", this.userStore.ActiveId);
        this.handleChatClick(this.userStore.ActiveId);
      } else if (this.userStore.DmChatroomsList.length != 0) {
        console.log(" I am her ", this.userStore.DmChatroomsList);
        this.handleChatClick(this.userStore.DmChatroomsList[0]);
      }
    },

    getStatusClass(status) {
      if (status)
        return "border-4 border-green-500 ";
    },

    moveTheBar() {
      console.log(" dfdf ");
      this.show = !this.show;
    },
    play(member) {
      console.log("This is the member of", member);
      this.userStore.creatchallenge = true;
      this.userStore.Opponent = member;
      console.log(this.person, this.ActiveChannelId);
      console.log(this.$GameSocket);
    },
  },

  async mounted() {
    await this.fetchData();
    await this.SocketNoti();

    this.$socket.on("receiveMessage", (data) => {
      console.log(" receiveMessage form Group Friend ********* ", data);
      if (
        (data.type == "notification" && data.action == "joined") ||
        (data.type == "notification" && data.action == "status") ||
        (data.type == "notification" && data.action == "kick")
      ) {
        this.fetchData();
      }
      if (data.type == "notification" && data.action == "kick") {
        this.fetchData();
        this.SocketNoti();
      }
    });

    this.$socket.on("userStatus", (data) => {
      console.log(" receiveMessage  user Status  ********* ", data);
      console.log(this.userStore.DmChatroomsList);
      //   this.userStore.fetchDataForDmChatRooms();
      this.userStore.DmChatroomsList.forEach((element) => {
        console.log(element);
        if (data.id == element.id) {
          element.statusOnline = data.online;
          console.log(" I am get the id **--------------------------------------");
        }
      });
    });
    if (this.userStore.ActiveId) {
      this.$emit("object-sent", this.userStore.ActiveId);
      this.userStore.UpdateChannelId(
        this.userStore.ActiveId.id,
        this.userStore.ActiveId.title
      );
    }
  },
};
</script>

<style>
/* Add your CSS styling here */

/* we will explain what these classes do next! */
/* .v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
} */
</style>
