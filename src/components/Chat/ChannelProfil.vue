<!-- FriendListComponent.vue -->
<template>
  <div class="flex flex-col m-2 p-5 h-full rounded-lg  items-center bg-slate-300">
    <div class="flex-shrink-0">
      <img src="https://cdn1.iconfinder.com/data/icons/developer-set-2/512/users-512.png" alt="Avatar"
        class="h-40 rounded-full" />

      <EditeProfile v-if="EditChannel" />
      <ConfirmPopup v-if="this.userStore.action" />
      <UpdateMember v-if="this.userStore.MemberRoleStatus" />
    </div>
    <div class=" flex italic text-2xl">
      <span class="text-center text-red-950
      text-lg underline decoration-wavy font-semibold">{{ this.userStore.ActiveChannelTitle }}</span>
    </div>
    <div class="flex flex-row">
      <FriendList v-if="AddFriend" />
      <img referrerpolicy="no-referrer" @click="LeaveChannel" title="Leave Channel"
        class="m-2 h-10 rounded-full  hover:scale-150 text-white font-bold py-2 px-4" src="./../../assets/icons/exit.svg">
      <img referrerpolicy="no-referrer" v-if="DeletePermission" @click="RemoveChatRome" title="Delete Channel"
        class=" m-2 h-10 rounded-full  hover:scale-150  text-white font-bold py-2 px-4"
        src="./../../assets/icons/delet.svg">
    </div>
    <div class="m-1 p-1 rounded-lg bg-slate-300">
      <ul class="">
        <li v-for="member in  this.userStore.ActiveMembersChannelId" class="flex items-center p-2 space-x-4 border-b ">
          <div class="flex-shrink-0">
            <img referrerpolicy="no-referrer" :src="member.user.avatar" alt="Avatar" title="View Profil"
              class="h-8 rounded-full hover:scale-150" />
            <!-- <span class="group-hover/edit:text-gray-700 ...">Call</span> -->
          </div>
          <div class="flex-grow">
            <span v-if="member.user.id == this.userStore.MyId" class="text-lg font-semibold">{{ member.user.username }}({{
              this.you }})</span>
            <span v-else class="text-lg font-semibold">{{ member.user.username }}</span>
            <p class="text-sm text-green-700">{{ member.role }} ({{ member.userStatus }})</p>
          </div>
          <div class="flex-grow">
            <img referrerpolicy="no-referrer" v-if="member.role != 'owner' && member.user.id != this.userStore.MyId"
              @click="UpdateMember(member)" title="Setting"
              class=" m-2 h-10 rounded-full hover:bg-blue-200 hover:scale-150  text-white font-bold py-2 px-4"
              src="./../../assets/icons/setting.svg">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import EditeProfile from "./EditeProfile.vue"
import { useUserStore } from './../../stores/state.ts';
import FriendList from "./FriendList.vue";
import MutePopUp from "./MutePopUp.vue";
import ConfirmPopup from "./ConfirmPopup.vue";
import UpdateMember from './UpdateMember.vue'

export default {

  components: { EditeProfile, FriendList, MutePopUp, ConfirmPopup, UpdateMember },
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
      you: 'You',
      time: "",
      role: '',
      EditChannel: true,
      Error: '',
      Updatemember: false,
    };
  },
  methods: {
    async fetchData() {
      this.role = await axios.get(`http://10.32.125.38:3000/api/chat-rooms/myrole/${this.userStore.ActiveChannelId}`,
        { withCredentials: true });
      if (this.role.data.role == 'member') {
        this.AddFriend = false;
        this.DeletePermission = false;
        this.EditChannel = false;
      }
      if (this.role.data.role == 'owner')
        this.DeletePermission = true
      await this.userStore.fetchChannelById();
    },
    LeaveChannel() {
      this.userStore.action = 'Leave';
    },
    RemoveChatRome() {
      this.userStore.action = 'Delete';
    },
    closePopup() {
      this.isOpend = false

    },

    UpdateMember(member) {
      console.log("I am here to update setting ", member)
      this.userStore.MemberRoleStatus = member

    },
  },
  async mounted() {

     await this.$socket.on("ChatRoomList", (data) => {
        console.log("This is data from channel profile : ", data)
        if ( data.type == 'updated') {
          this.fetchData();
          console.log( "hoooo " , this.userStore.ActiveMembersChannelId)
        }
      }
      );
    this.$socket.on("receiveMessage", (data) => {
      console.log("receiveMessage form channel profile--------- ", data)
      if ((data.type == 'notification' && data.action == 'joined') ||
        (data.type == 'notification' && data.action == 'status') ||
        (data.type == 'notification' && data.action == 'role')
      ) {
        this.fetchData();
      }

    },);
    this.fetchData();
  },


};
</script>
  
<style>
/* Add your CSS styling here */
</style>
  