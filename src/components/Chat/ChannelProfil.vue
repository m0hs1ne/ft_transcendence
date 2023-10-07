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
     Hello
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useUserStore } from './../../stores/counter.js';
  export default {
    data() {
      return {
        friends: [{}],
      };
    },
    methods: {
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
  

  //     const userStore = useUserStore();
  //  console.log(userStore);
  //  console.log(" I am in Channel")
  //  console.log(userStore.fetchData(1))
  

    },
  };
  </script>
  
  <style>
  /* Add your CSS styling here */
  </style>
  