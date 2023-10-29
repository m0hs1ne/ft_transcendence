<!-- FriendListComponent.vue -->
<template>
  <div class="flex items-center justify-start w-full rounded-2xl bg-transparent gap-0.5 md:gap-2 p-5">
    <Icon class="w-8 h-8 cursor-pointer" icon="ion:arrow-back" @click="this.userStore.viewMode = 'Chat'" />
    <h1 class="font-bold text-xl">Channel Profile:</h1>
  </div>
  <hr class="w-full h-px bg-gray-200 border-0 dark:bg-gray-700 dark:text-white" />


  <div class="flex h-full flex-col items-center pt-10 px-10 overflow-y-scroll">
    <div class="w-32 h-32 bg-gray-200 rounded-full shadow">
      <Icon class="text-blue-600 h-32 w-32" icon="clarity:group-solid" />
    </div>

    <div class="flex italic text-2xl mt-1.5">
      <span class="text-center dark:text-white text-lg font-bold">
        {{ this.userStore.ActiveChannelTitle }}
      </span>
    </div>

    <div
      class="flex w-fit custom-box-shadow p-3 dark:bg-slate-800 rounded-lg my-10 flex-row items-center justify-center gap-3 md:gap-5">
      <div class="flex">
        <EditeProfile v-if="this.EditChannel" />
        <!-- <ConfirmPopup v-if="this.userStore.action" /> -->
        <UpdateMember v-if="this.userStore.MemberRoleStatus" />
      </div>

      <FriendList v-if="AddFriend" />

      <Icon @click="LeaveChannel" title="Leave Channel" icon="ion:exit"
        class="text-black dark:text-white h-8 w-8 md:h-10 md:w-10 hover:bg-blue-400 p-1 rounded-md cursor-pointer" />

      <Icon v-if="DeletePermission" icon="ic:round-delete" @click="RemoveChatRome" title="Delete Channel"
        class="text-black dark:text-white h-8 w-8 md:h-10 md:w-10 hover:bg-blue-300 p-1 rounded-md cursor-pointer" />
    </div>

    <div v-for="member in this.userStore.ActiveMembersChannelId"
      class="flex w-full h-fit gap-2 mb-3 custom-box-shadow p-3 dark:bg-slate-800 rounded-lg flex-row items-center">
      <div class="w-14 bg-gray-300 rounded-full">
        <img referrerpolicy="no-referrer" :src="member.user.avatar" alt="Avatar" title="View Profil"
          class="w-14 aspect-square object-cover rounded-full" />
      </div>
      <div class="flex flex-col container overflow-ellipsis line-clamp-1">
        <span v-if="member.user.id == this.userStore.MyId" class="text-lg font-semibold">
          {{ member.user.username }}({{ this.you }})
        </span>
        <span v-else class="text-lg font-semibold">{{ member.user.username }}</span>
        <p class="text-sm text-green-700">
          {{ member.role }} ({{ member.userStatus }})
        </p>
      </div>

      <div v-if="this.MyRole != 'member'" class="flex-grow">
        <Icon v-if="member.role != 'owner' && member.user.id != this.userStore.MyId" @click="UpdateMember(member)"
          title="Setting" class="text-blue-500 h-10 w-10 ml-3 cursor-pointer hover:bg-blue-100 p-1 rounded-md"
          icon="mingcute:settings-3-fill" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import EditeProfile from "./EditeProfile.vue";
import { useUserStore } from "./../../stores/state.ts";
import FriendList from "./FriendList.vue";
import MutePopUp from "./MutePopUp.vue";
import ConfirmPopup from "./ConfirmPopup.vue";
import UpdateMember from "./UpdateMember.vue";
import { Icon } from "@iconify/vue";

export default {
  components: { EditeProfile, FriendList, MutePopUp, ConfirmPopup, UpdateMember, Icon },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      AddFriend: true,
      Mute: false,
      DeletePermission: false,
      memberProp: {},
      isOpend: false,
      you: "You",
      time: "",
      role: "",
      EditChannel: true,
      Error: "",
      Updatemember: false,
      MyRole: "",
    };
  },
  methods: {
    async fetchData() {
      this.role = await axios.get(
        `http://localhost:3000/api/chat-rooms/myrole/${this.userStore.ActiveChannelId}`,
        { withCredentials: true }
      );

      if (this.role.data.role == "member") {
        this.AddFriend = false;
        this.DeletePermission = false;
        this.EditChannel = false;
      }
      if (this.role.data.role == "owner") this.DeletePermission = true;
      if (this.role.data.role == "admin") this.AddFriend = true;
      this.MyRole = this.role.data.role;
      await this.userStore.fetchChannelById();
    },
    LeaveChannel() {
      this.userStore.action = "Are you sure you want to Leave this Channel?";
    },
    RemoveChatRome() {
      this.userStore.action = "Are you sure you want to Delete this Channel?";
    },
    closePopup() {
      this.isOpend = false;
    },

    UpdateMember(member) {
      console.log("I am here to update setting ", member);
      this.userStore.MemberRoleStatus = member;
    },
  },
  async mounted() {
    await this.$socket.on("ChatRoomList", (data) => {
      console.log("This is data from channel profile : ", data);
      if (data.type == "updated") {
        this.fetchData();
      }

    });
    await this.$socket.on("receiveMessage", (data) => {
      console.log("receiveMessage form channel profile--------- ", data);
      if (
        (data.type == "notification" && data.action == "joined") ||
        (data.type == "notification" && data.action == "status") ||
        (data.type == "notification" && data.action == "role") ||
        (data.type == "notification" && data.action == "kick")
      ) {
        if (data.action == "kick" && data.from.id == this.userStore.MyId)
          return;
        this.fetchData();
      }
    });
    this.fetchData();
  },
};
</script>
