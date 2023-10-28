<!-- FriendListComponent.vue -->
<template>
  <div
    class="flex flex-col w-full md:w-1/2 lg:w-1/3 dark:bg-slate-900 custom-box-shadow dark:text-white rounded-xl overflow-clip"
  >
    <div class="flex w-full flex-row dark:text-white pb-5 justify-evenly p-5">
      <AlertChannel />
      <PopUpinv />
    </div>
    <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-700 dark:text-white" />

    <ul class="overflow-y-scroll overflow-x-clip px-5 py-5">
      <li
        v-for="(conversation, index) in this.userStore.DmChatroomsList"
        :key="index"
        @click="selectChat(conversation, index)"
        :class="[
          'flex',
          'w-full',
          'items-center',
          'p-2',
          'cursor-pointer',
          'custom-box-shadow',
          'rounded-xl',
          'hover:bg-slate-200',
          'dark:hover:bg-slate-600',
          'mb-3',
          this.activeChatId === index
            ? 'bg-slate-200 dark:bg-slate-600'
            : 'bg-white dark:bg-slate-800',
        ]"
      >
        <div class="flex w-full">
          <div class="w-12 bg-gray-200 rounded-full shadow mr-4">
            <img
              v-if="conversation.avatar"
              :src="conversation.avatar"
              alt="Avatar"
              class="w-12 h-12 rounded-full object-cover"
            />
            <Icon v-else class="text-blue-600 w-12 h-12" icon="clarity:group-solid" />
          </div>
          <GameMode v-if="this.userStore.creatchallenge" />
          <div class="flex flex-col items-start justify-center">
            <span class="text-lg font-bold text-ellipsis line-clamp-1"
              >{{ conversation.username }} {{ conversation.title }}</span
            >
            <p class="text-sm text-gray-500">
              {{
                !conversation.avatar
                  ? conversation.privacy
                  : conversation.statusOnline
                  ? "Online"
                  : "Ofline"
              }}
            </p>
          </div>
        </div>
        <!-- <Icon
          v-if="conversation.iqnGame == false && conversation.statusOnline == true"
          @click="play(conversation)"
          title="Play"
          class="text-blue-600 h-10 w-10 ml-3"
          icon="mingcute:game-2-fill"
        /> -->
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
import { ref } from "vue";

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
      activeChatId: -1,
      friends: [],
    };
  },
  methods: {
    async fetchData() {
      await this.userStore.fetchDataForDmChatRooms();
      //console.log(" -------------------------------------------------> OLO ", this.userStore.DmChatroomsList);
      if (
        this.userStore.DmChatroomsList.length == 0 ||
        this.userStore.DmChatroomsList.data == 0
      )
        this.message = " 5liha 3la allah ";
      else {
        //console.log(" this.userStore.DmChatroomsList ", this.userStore.DmChatroomsList);
        this.friends = this.userStore.DmChatroomsList.data;
      }
    },
    selectChat(Item, index) {
      this.activeChatId = index;
      this.userStore.viewMode = "Chat";
      this.userStore.ItemClicked = Item;
      this.userStore.IndexItemClicked = index;
    },
    handleChatClick(Item, index) {
      // Your click event logic here
      //console.log("Prop emitd");
      //console.log(Item);
      this.$emit("object-sent", Item);
      this.userStore.UpdateChannelId(Item.id, Item.title);
    },

    async SocketNoti() {
      // //console.log(" Noting ")
      // await this.userStore.fetchDataForDmChatRooms();
      await this.$socket.on("ChatRoomList", (data) => {
        //console.log("This is data ChatRoomList on : ", data);
        if (data.type == "new" || data.type == "updated") {
          this.userStore.fetchDataForDmChatRooms();
        }
        if (data.type == "remove") {
          this.userStore.fetchDataForDmChatRooms();
          if (this.userStore.DmChatroomsList.length != 0)
            this.handleChatClick(this.userStore.DmChatroomsList[0]);
        }
      });

      // if (this.userStore.ActiveId.length) {

      //   this.handleChatClick(this.userStore.ActiveId);
      // } else if (this.userStore.DmChatroomsList.length != 0) {
      //   this.handleChatClick(this.userStore.DmChatroomsList[0]);
      // }
    },

    getStatusClass(status) {
      if (status) return "border-4 border-green-500 ";
    },
  },

  async mounted() {
    await this.fetchData();
    await this.SocketNoti();

    this.$socket.on("receiveMessage", (data) => {
      // //console.log(data , "this data form reciveMesssage ", data)
      if (data.type == "DM") {
        const friendIndex = this.userStore.DmChatroomsList.findIndex(
          (friend) => friend.id === data.message.from.id
        );
        if (friendIndex == -1) {
          ////console.log(" new data ....");
          this.userStore.fetchDataForDmChatRooms();
        }
      }
      if (data.type == "notification" && data.action == "joined") this.fetchData();
      else if (
        data.chatRoomId == this.userStore.ActiveChannelId &&
        ((data.type == "notification" && data.action == "joined") ||
          (data.type == "notification" && data.action == "status"))
      ) {
        this.fetchData();
      }
      if (
        data.type == "notification" &&
        data.action == "kick" &&
        data.from.id == this.userStore.MyId
      ) {
        this.fetchData();
        this.SocketNoti();
      }
    });

    this.$socket.on("userStatus", (data) => {
      // //console.log(" receiveMessage  user Status  ********* ", data);
      // //console.log(this.userStore.DmChatroomsList);
      //   this.userStore.fetchDataForDmChatRooms();
      this.userStore.DmChatroomsList.forEach((element) => {
        //console.log(element);
        if (data.id == element.id) {
          element.statusOnline = data.online;
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
.scrollbar {
  overflow-y: scroll;
  scrollbar-width: thin; /* Make the scrollbar thinner */
}
</style>
