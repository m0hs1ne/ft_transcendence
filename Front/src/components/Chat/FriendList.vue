<!-- FriendListComponent.vue -->
<template>
  <Icon class="text-black dark:text-white  h-8 w-8 md:h-10 md:w-10 hover:bg-blue-400 p-1 rounded-md  cursor-pointer" @click="openPopup"
    title="Add Friend " icon="basil:add-solid" />

  <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center dark:bg-slate-800">
    <div class="bg-white rounded-lg p-6  custom-box-shadow dark:bg-slate-900">
      <h2 class="text-xl font-bold mb-4">Add friends:</h2>
      <div>{{ this.message }}</div>
      <ul class="">
        <li v-for="friend in friends" :key="friend.id" class="flex items-center p-2 space-x-4 border-b">
          <div class="flex-shrink-0">
            <img referrerpolicy="no-referrer" :src="friend.avatar" alt="Avatar" class="h-12 rounded-full" />
          </div>
          <div class="flex-grow">
            <span class="text-lg font-semibold">{{ friend.username }}</span>
          </div>
          <button @click="sendInvite(friend)"
            class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Invite
          </button>
        </li>
      </ul>

      <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Close
      </button>
      <!-- <button v-if="selectedOption != '' && ChannelName != ''" @click="SaveChannel"
        class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
      </button> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from './../../stores/state.ts';
import { Icon } from "@iconify/vue";


export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  components: {
    Icon,
  },
  data() {
    return {
      isOpend: false,
      friends: [],
      members: [],
      message: ''

    };
  },
  methods: {
    async fetchData() {
      await this.userStore.fetchChannelById();
      this.members = this.userStore.ActiveMembersChannelId;
      await this.userStore.FetchFriend();
      // handl friend 

      console.log("This Friends : ", this.userStore.UserFriends.data)
      console.log("This Members : ", this.members);
      // if (this.friends.length === 0) {
      //   this.message = "you don't have any friends to invite them";
      // }

      this.userStore.UserFriends.data.forEach(element => {
        // to get friends not found in the channel
        var boool = true;

        for (const obj of this.members) {

          if (obj.user.id == element.id) {
            boool = false;
            break;
          }
        }
        if (boool) {
          this.friends.push(element);
        }
        if (this.friends.length === 0) {
          this.message = "you don't have any friends to invite them";
        
        }
        //this.friends.push(element);
      });
    },
    async openPopup() {
      this.isOpend = true;
    },
    closePopup() {
      this.isOpend = false;
    },
    sendInvite(friend) {
      console.log(" ActiveChannelId ", this.userStore.ActiveChannelId)
      this.$socket.emit(
        "sendInvite",
        { toId: friend.id, chatId: this.userStore.ActiveChannelId }, () => { },);
      console.log("console ", friend)
      this.isOpend = false;
    }
  },
  mounted() {
    this.fetchData();
  },

};
</script>

<style>
/* Add your CSS styling here */
</style>
