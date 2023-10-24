<!-- FriendListComponent.vue -->
<template>
  <div id="sidebar" class="flex w-1/4 align-middle flex-col h-full bg-slate-300">
    <div class="flex flex-col">
      <img referrerpolicy="no-referrer" @click="moveTheBar()" title="moveTheBar"
        class="float-left h-10 rounded-full hover:scale-150 text-white font-bold py-2"
        src="./../../assets/icons/side-menu.svg" />
      <AlertChannel />
      <PopUpinv />
    </div>

    <Transition>
      <div class="w-full rounded-lg h-full">
        <ul>
          <li v-for="friend in this.userStore.DmChatroomsList" :key="friend.id"
            class="flex items-center justify-between p-2 border-b">
            <div class="flex-shrink-0">
              <img :src="friend.avatar
                ? friend.avatar
                : 'https://cdn1.iconfinder.com/data/icons/developer-set-2/512/users-512.png'
                " @click="handleChatClick(friend)" alt="Avatar" :class="getStatusClass(friend.statusOnline)"
                class="h-12 rounded-full" />
            </div>
            <GameMode v-if="this.userStore.creatchallenge" />
            <div v-if="show" class="flex-row">
              <span class="text-lg font-semiboldusername overflow-ellipsis line-clamp-1">{{ friend.username }} {{
                friend.title }}</span>
              <p class="text-sm text-gray-500">{{ friend.lastmessage }}</p>
            </div>
            <img referrerpolicy="no-referrer" v-if="friend.inGame == false && friend.statusOnline == true"
              @click="play(friend)" title="Play" class="h-10 hover:scale-150 text-white font-bold py-2 px-4"
              src="./../../assets/icons/ping.svg" />
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script>
import AlertChannel from "./AlertChannel.vue";
import PopUpinv from "./PopUpinv.vue";
import axios from "axios";
import { useUserStore } from "./../../stores/state.ts";
import GameMode from "./GameMode.vue";
export default {
  components: {
    AlertChannel,
    PopUpinv,
    GameMode,
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
      this.$emit('object-sent', this.userStore.ActiveId);
      this.userStore.UpdateChannelId(this.userStore.ActiveId.id, this.userStore.ActiveId.title);
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
