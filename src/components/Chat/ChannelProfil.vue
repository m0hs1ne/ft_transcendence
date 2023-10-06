<!-- FriendListComponent.vue -->
<template>
    <div class="flex flex-col m-2 p-5 h-full rounded-lg  items-center bg-slate-300">
      <!-- <div class="flex-shrink-0">
        <img
          :src="this.person.avatar"
          alt="Avatar"
          class="h-40 rounded-full"
        />
      </div>
      <div class="flex">
        <span class="text-lg font-semibold">{{ this.person.username }}</span>
      </div>
      <div class="flex flex-row">
      <button class="flex items-center text-gray-700 hover:text-gray-900" @click="ViewProfil">
          <span class="ml-2 h-10">View Profil</span>
      </button>
      <button class="flex items-center text-gray-700 hover:text-gray-900" @click="Block">
          <span class="ml-2 h-10">Block</span>
      </button>
      </div> -->
      {{  this.Channeldetails }}
    </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    data() {
      return {
        friends: [{}],
      };
    },
    props: {
        Channeldetails: {
        type: Object,
        required: true,
      },
    },
    methods: {
      fetchData() {
        //     axios
        //       .get("http://localhost:3000/api/users/friends/", { withCredentials: true })
        //       .then((response) => {
        //         this.responseData = response.data;
        //         this.friends = this.responseData.friends
        //         console.log(" i am here ", this.responseData.friends);
        //         console.log(this.friends)
        //       })
        //       .catch((error) => {
        //         console.error("Error fetching data:", error);
        //       });
        //   },
        //   handleChatClick(Item) {
        //     // Your click event logic here
        //     console.log("Prop emitd ");
        //     // console.log(Item)
        //
     
      },
      Block()
        {
          console.log(" block user ")
        },
        ViewProfil()
        {
          console.log("Go to profile")
        }
    },
    mounted() {
      console.log(" mounted in ChannelProfile  ", this.Channeldetails);
    },
  };
  </script>
  
  <style>
  /* Add your CSS styling here */
  </style>
  