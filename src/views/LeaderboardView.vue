<script>
import { ref } from "vue";
import axios from "axios";
import { SharedData } from '../stores/state.ts';

export default {
  setup(props) {
    const isError = ref(false);
    const state = SharedData();
    return { state, isError };
  },
  data() {
    return {
      leaderboard: [],
    };
  },
  methods: {
    async getLeaderBoard() {
      this.isError = false;

      try {
        const response = await axios.get("http://10.32.125.38:3000/api/users/leaderboard", {
          withCredentials: true,
        });
        this.leaderboard = response.data;
        this.leaderboard.sort((a, b) => ((b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses))));
        //console.log("leaderboard is : ", this.leaderboard);
      } catch (error) {
        console.error("getLeaderBoard:", error);
        this.isError = true;
      }
    },
  },
  async mounted() {
    await this.getLeaderBoard();
  },
};
</script>

<template>
  <div v-if="this.isError" class="flex ml-20 lg:ml-24 items-center justify-center h-screen dark:bg-slate-800 p-10">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Opps!!</h1>
      <p class="text-lg text-gray-600 mt-4 mx-20 lg:mx-40 dark:text-gray-400">
        Something went wrong. feel free to contact us if the problem presists.
      </p>
      <div class="flex gap-5 items-center justify-center w-full">
        <button @click="this.$router.push('/')" class="mt-8 text-blue-500 hover:underline text-lg">Go to Home</button>
        <button @click="this.$router.go(-1)" class="mt-8 text-blue-500 hover:underline text-lg">Go Back</button>
        <button @click="this.isError = false" class="mt-8 text-blue-500 hover:underline text-lg">Refresh</button>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col justify-start items-center min-h-screen ml-20 lg:ml-24 dark:bg-slate-800 p-5  md:p-10">
    <h1 class=" font-semibold text-3xl md:text-4xl dark:text-white pb-5 md:pb-10">
      Leaderboard:
    </h1>
    <div v-for="(player, index) in this.leaderboard" :key="index"
      class="flex items-center justify-start w-full max-w-[500px] my-2 px-5 py-3 rounded-2xl custom-box-shadow dark:bg-slate-700 dark:text-white">
      <router-link :to="'/users/' + player.id" class="flex items-center justify-between min-w-full">
        <div class="flex items-center">
          <p class=" font-semibold text-lg md:text-xl">{{ index + 1 }}.</p>
          <div class="w-12 h-12 md:w-20 md:h-20 bg-gray-300 rounded-full shadow ml-2 mr-2  md:mr-4">
            <img referrerpolicy="no-referrer" :src="player.avatar" alt="Avatar"
              class="aspect-square object-cover rounded-full w-12 h-12 md:w-20 md:h-20" />
          </div>
          <p class="w-36 md:w-56 overflow-ellipsis line-clamp-1  font-semibold md:text-xl tracking-wide dark:text-white">
            {{ player.username }}
          </p>
        </div>
        <p class="min-w-fit font-semibold text-xl md:text-2xl tracking-wide dark:text-white">
          {{ parseInt((player.wins / (player.wins + player.losses)) * 100) }}%
        </p>
      </router-link>
    </div>
  </div>
</template>
