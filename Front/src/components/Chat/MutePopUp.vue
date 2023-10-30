<!-- FriendListComponent.vue -->
<template>
  <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
    <div class="bg-blue-100 rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4">Time with minute:</h2>
         
      <input type="number" v-model="time" >
      <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        save
      </button>
      <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Close
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from './../../stores/state.ts';
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  
  data() {
    return {
      isOpend: true,
      time:0,
    };
  },
  props:
  {
    memberProp:{
        type:Object,
        required: true,
    }
  },
  methods: {
    async fetchData() {
      await this.userStore.fetchChannelById();
      this.members = this.userStore.ActiveMembersChannelId;
      await this.userStore.FetchFriend();
      // handl friend 

       //console.log("This Friends : " ,this.userStore.UserFriends.data)
       //console.log("This Members : " ,this.members)
      this.userStore.UserFriends.data.forEach(element => {
        // to get friends not found in the channel
        var boool = true;

        for (const obj of this.members) {

            if (obj.user.id == element.id)
            {
              boool = false;
              break;
            }
        }
        if (boool) {
          this.friends.push(element);
        }
        //this.friends.push(element);
      });
    },
    async openPopup() {
        this.isOpend = true;
    },
    closePopup() {
      this.isOpend = false;
     
      //console.log("I am pop up")
    },
    sendInvite(friend) {
      //console.log(" ActiveChannelId ", this.userStore.ActiveChannelId)
      this.$socket.emit(
        "sendInvite",
        { toId: friend.id, chatId: this.userStore.ActiveChannelId }, () => { },);
      //console.log("console ", friend)
      this.isOpend = false;
    }
  },
  mounted() {
    this.openPopup();
    // //console.log("Probs",this.memberProp)
   // this.fetchData();
  },

};
</script>

<style>
/* Add your CSS styling here */
</style>
