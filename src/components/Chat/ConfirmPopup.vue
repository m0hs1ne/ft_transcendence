<template>
  <div>
    <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center dark:text-white dark:bg-slate-800">
      <div class="bg-white rounded-lg p-6  custom-box-shadow dark:bg-slate-900">
        <h2 class="text-xl font-bold mb-4"> {{ this.userStore.action }}</h2>
        <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          La
        </button>
        <button @click="SaveChannel" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ah
        </button>
      </div>
    </div>
  </div>
</template>
  
<script>
import { useUserStore } from '../../stores/state.ts';
import axios from "axios";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      ChannelName: '',
      selectedOption: '',
      password: '',
      isOpend: false,
      message: false,
      id:'',
    };
  },
  methods: {
    async SaveChannel() {

      console.log("ok " ,this.userStore.action,'ed');
      if ( this.userStore.action == 'Are you sure you want to Leave this Channel?') {
     //   console.log(" I AM HERE TO ")
        await this.$socket.emit("kickMember",
          {
            memberId: this.userStore.MyId,
            chatId: this.userStore.ActiveChannelId
          })
      }
      else if(this.userStore.action == 'Are you sure you want to Block this User?')
      {
          console.log(this.id)
          axios
        .post(
          "http://10.32.125.38:3000/api/users/blocked/",
          {
            id: parseInt(this.id),
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          //console.log(response);
        })
        .catch((error) => {
          //console.error("Error fetching data:", error);
        });
        this.userStore.ActiveChannelId = -1
        this.userStore.ItemClicked = ''
        this.userStore.fetchChannelById();
        this.activeChatId = '';
        console.log("===================>",this.userStore.ItemClicked)
      }
      else{
        
        this.$socket.emit("removeChatRoom",
        {
          id : this.userStore.ActiveChannelId
        })
   
        this.userStore.ActiveChannelId = -1
      }
      // console.log("I am her in error")
      // console.log(this.userStore.DmChatroomsList)
      this.userStore.action = ''
    },

    closePopup() {
       
      console.log(" Mbitch ")
      this.isOpend = false;
      this.userStore.action = ''
    },
  },
  mounted() {
    console.log(this.userStore.action)
    if((typeof this.userStore.action) == "object")
    {
      this.id = this.userStore.action.id
      this.userStore.action = "Are you sure you want to Block this User?"
    }
    this.isOpend = true;
  },
};
</script>
  