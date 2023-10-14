<!-- FriendListComponent.vue -->
<template>
  <div class="flex flex-col m-2 p-5 h-full rounded-lg  items-center bg-slate-300">
    <div class="flex flex-row">
      <FriendList v-if="AddFriend"/>
      <img @click="LeaveChannel" class="m-2 h-10 rounded-full  hover:bg-red-500 text-white font-bold py-2 px-4"
        src="./../../assets/icons/exit.svg">
      <img v-if="DeletePermission" @click="Dlete"
        class=" m-2 h-10 rounded-full hover:bg-red-200 text-white font-bold py-2 px-4"
        src="./../../assets/icons/delet.svg">
    </div>
    <div class="m-1 p-1 rounded-lg bg-slate-300">
      <ul class="">
        <li v-for="member in members" class="flex items-center p-2 space-x-4 border-b">
          <div class="flex-shrink-0">
                <!--  start pop up -->
            <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
              <div class="bg-blue-100 rounded-lg p-6">
                <h2 class="text-xl font-bold mb-4">Time with minute:</h2>

                <input type="number" v-model="time">
                <button v-if="this.time" @click="MuteThisUser(member)"
                  class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  save
                </button>
                <button @click="closePopup"
                  class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Close
                </button>
              </div>
            </div>
          <!--  end pop up -->
            <img :src="member.user.avatar" alt="Avatar" class=" h-8 rounded-full" />
          </div>
          <div class="flex-grow">
            <span v-if="member.user.id == this.userStore.MyId" class="text-lg font-semibold">{{ member.user.username }}({{ this.you }})</span>
            <span v-else class="text-lg font-semibold">{{ member.user.username }}</span>
            <p class="text-sm text-green-700">{{ member.role }}</p>
          </div>
          <div class="flex-grow">
            <img v-if="member.role != 'owner'" @click="blockMember(member)"
              class=" m-2 h-10 rounded-full hover:bg-red-700 text-white font-bold py-2 px-4"
              src="./../../assets/icons/blocked.svg">
            <img v-if="member.role != 'owner'" @click="muteMember(member)"
              class=" m-2 h-10 rounded-full hover:bg-red-200 text-white font-bold py-2 px-4"
              src="./../../assets/icons/mute2.svg">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import { useUserStore } from './../../stores/state.ts';
import FriendList from "./FriendList.vue";
import MutePopUp from "./MutePopUp.vue";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      members: [],
      messages: [],
      AddFriend: true,
      Mute: false,
      DeletePermission: false,
      memberProp: {},
      isOpend : false,
      you:'You',
      time:"",

    };
  },
  methods: {
    async fetchData() {
      const role = await axios.get(`http://localhost:3000/api/chat-rooms/myrole/${this.userStore.ActiveChannelId}`,
        { withCredentials: true });
      console.log("I am rol", role.data)
      if (role.data.role == 'member') {
          console.log("I am just an member role")
          this.AddFriend = false;
          this.DeletePermission = false;
      }
      if (role.data.role != 'owner')
        this.DeletePermission = 'true'
      await this.userStore.fetchChannelById();
      this.members = this.userStore.ActiveMembersChannelId;
      console.log("This is members: ",this.members);
      // console.log("This is members: ",this.userStore.MyId);
    },
    LeaveChannel() {
      console.log(" I am leaving the channel My id:", this.userStore.MyId, "Chatid:", this.userStore.ActiveChannelId, "redicte the chat hom")
      this.$socket.emit("kickMember",
        {
          "memberId": this.userStore.MyId,
          "chatId": this.userStore.ActiveChannelId
        })
    },
    RemoveChatRome() {
      //if the user is owner
      // {
      //   "chatId": "number"
      // }
      console.log("Remove Chat Rome")
    },
    closePopup() {
      //if the user is owner
      // {
      //   "chatId": "number"
      // }
      this.isOpend = false
      this.time = '';

      //console.log("Remove Chat Rome")
    },
    muteMember(member) {
      this.isOpend = true
    },
    MuteThisUser(member)
    {
        console.log('Muste this user:', member ," for time: ", this.time);
        this.isOpend = false;
        this.time = '';
    },
  

  },
  mounted() {
    this.fetchData();
  },

  components: { FriendList, MutePopUp }
};
</script>
  
<style>
/* Add your CSS styling here */
</style>
  