<!-- FriendListComponent.vue -->
<template>
  <div class="flex flex-col m-2 p-5 h-full rounded-lg  items-center bg-slate-300">
    <GameMode v-if="this.userStore.creatchallenge" />
    <div class="flex-shrink-0">
      <img referrerpolicy="no-referrer" :src="this.person.avatar" alt="Avatar" class="h-40 rounded-full" />
    </div>
    <div class="flex">
      <span class="text-lg font-semibold">{{ this.person.username }}</span>
    </div>
    <div class="flex flex-col items-center">
      <button class="flex items-center text-gray-700 hover:text-gray-900"
        @click="this.$router.push(`/users/${this.person.id}`)">
        <span class="ml-2 h-10">View Profil</span>
      </button>
      <button class="flex items-center text-gray-700 hover:text-gray-900" @click="Block">
        <span class="ml-2 h-10">Block</span>
      </button>
      <button v-if="this.person.inGame == false" class="flex items-center text-gray-700 hover:text-gray-900"
        @click="play">
        <span class="ml-2 h-10">Play</span>
      </button>
      <button v-else-if="this.person.inGame == true" class="flex items-center text-gray-700 hover:text-gray-900">
        <span class="ml-2 h-10">Playing ......</span>
      </button>



    </div>
  </div>
</template>

<script>
import { useUserStore } from './../../stores/state.ts';
import GameMode from './GameMode.vue';
import axios from "axios";


export default {
  components: { GameMode },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      friends: [{}],
      creatchallenge: false,
    };
  },
  props: {
    person: {
      type: Object,
      required: true,
    },
  },
  methods: {
    fetchData() {

    },
    Block() {
      console.log(" block user ", this.person)

      axios.post("http://localhost:3000/api/users/blocked/", {

        id: parseInt(this.person.id)
      }, {
        withCredentials: true,
      })
        .then((response) => {
          console.log("response axios ", response)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
        
    },
    play() {

      this.userStore.creatchallenge = true;
      this.userStore.Opponent = this.person;
      console.log(this.person, this.ActiveChannelId)


    },

    ViewProfil() {
      console.log("Go to profile")
    }
  },
  mounted() {



  },
};
</script>

<style>
/* Add your CSS styling here */
</style>
