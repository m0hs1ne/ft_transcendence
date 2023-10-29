<script>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import ProfileStat from "./../components/Profile/ProfileStat.vue";
import { SharedData } from "./../stores/state.ts";
import Loading from "../components/Loading/Loading.vue";

export default {
  setup(props) {
    const state = SharedData();
    const username = ref("");
    const avatar = ref("");
    const wins = ref(1);
    const losses = ref(1);
    const battles = ref(1);
    const winrat = ref(1);
    const friends = ref([]);
    const games = ref([]);
    const is2FA = ref(false);
    const friendTab = ref(false);
    const achievements = ref(false);
    const isError = ref(false);
    const isLoading = ref(false);

    return {
      username,
      avatar,
      wins,
      games,
      achievements,
      battles,
      winrat,
      friendTab,
      friends,
      state,
      isError,
      isLoading,
    };
  },
  components: {
    ProfileStat,
    Icon,
    Loading,
  },
  methods: {
    setData() {
      this.username = this.state.userData.username;
      this.avatar = this.state.userData.avatar;
      this.wins = this.state.userData.wins - 1;
      this.losses = this.state.userData.losses - 1;
      this.battles = this.state.userData.wins + this.state.userData.losses - 2;
      this.winrat =
        parseInt(
          (this.state.userData.wins /
            (this.state.userData.wins + this.state.userData.losses)) *
          100
        ) + "%";
      this.friends = this.state.userData.friends;
      this.games = this.state.userData.games;
      this.is2FA = this.state.userData.is2faEnabled;

      this.achievements = [
        {
          icon: "ph:rocket-fill",
          title: "Unstoppable",
          desc: "Play 10 games",
          status: this.battles >= 10,
        },
        {
          icon: "ph:baby-fill",
          title: "Newbie",
          desc: "Win 3 games",
          status: this.wins >= 3,
        },
        {
          icon: "ph:medal-fill",
          title: "Winner",
          desc: "Win 10 games",
          status: this.wins >= 10,
        },
        {
          icon: "ph:hand-fill",
          title: "Master",
          desc: "Win 100 games",
          status: this.wins >= 100,
        },
        {
          icon: "ph:fire-fill",
          title: "Grand Master",
          desc: "Win 1000 games",
          status: this.wins >= 1000,
        },
        {
          icon: "solar:danger-bold",
          title: "Loser",
          desc: "Lose 10 games",
          status: this.losses >= 10,
        },
        {
          icon: "ph:users-three-fill",
          title: "Squad",
          desc: "Add 3 friends",
          status: this.friends.length >= 3,
        },
        {
          icon: "icon-park-solid:protect",
          title: "Safety first",
          desc: "Enable 2FA",
          status: this.is2FA,
        },
      ];

      // Sort achievements based on the status property
      this.achievements.sort((a, b) => b.status - a.status);
    },
  },
  mounted() {
    this.setData();
    this.$socket.on("Notification", async (data) => {
      if (data.type === "updated") {
        this.isLoading = true;
        this.isError = false;
        try {
          await this.state.updateData();
          this.setData();
        } catch (error) {
          this.isLoading = false;
          this.isError = true;
        }
        this.isLoading = false;
      }
    });
  },
};
</script>

<template>
  <Loading v-if="this.isLoading" />
  <!-- Error -->
  <div v-else-if="this.isError" class="flex ml-20 lg:ml-24 items-center justify-center h-screen dark:bg-slate-800 p-10">
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
  <!-- friends -->
  <div v-else-if="this.friendTab"
    class="flex flex-col justify-start items-center min-h-screen dark:bg-slate-800 p-10 ml-20 lg:ml-24">
    <div class="flex w-full justify-center items-center pb-10">
      <Icon @click="this.friendTab = false" icon="ion:arrow-back"
        class="text-gray-100 h-16 w-16 dark:text-white p-3 cursor-pointer" />
      <h1 class="font-semibold text-3xl md:text-4xl dark:text-white text-center items-center overflow-ellipsis">
        Your Friends:
      </h1>
    </div>
    <div v-if="!this.friends.length" class="h-full flex flex-col items-center">
      <img src="../assets/imgs/empty2.png" alt="" class="aspect-square object-cover" />
      <p class="font-bold text-gray-400 text-2xl pb-20 md:pb-0 text-center">lonely 😔</p>
    </div>
    <div v-for="(element, index) in this.friends" :key="index"
      class="flex items-center justify-start w-full max-w-[500px] my-2 px-5 py-3 rounded-2xl custom-box-shadow dark:bg-slate-700 dark:text-white">
      <router-link :to="'/users/' + element.id" class="flex items-center justify-between min-w-full">
        <div class="flex items-center">
          <p class="font-semibold text-xl">{{ index + 1 }}.</p>
          <div class="w-20 h-20 bg-gray-300 rounded-full shadow ml-2 mr-4">
            <img referrerpolicy="no-referrer" :src="element.avatar" alt="Avatar"
              class="aspect-square object-cover rounded-full w-20 h-20" />
          </div>
          <p class="w-36 md:w-56 overflow-ellipsis line-clamp-1 font-semibold md:text-xl tracking-wide dark:text-white">
            {{ element.username }}
          </p>
        </div>
        <p class="min-w-fit font-semibold text-xl md:text-2xl tracking-wide dark:text-white">
          {{ parseInt((element.wins / (element.wins + element.losses)) * 100) }}%
        </p>
      </router-link>
    </div>
  </div>
  <!-- Profile -->
  <div v-else class="grid grid-cols-1 h-full md:grid-cols-2 gap-10 p-10 ml-20 lg:ml-24 min-h-screen dark:bg-slate-800">
    <!-- <ProfileCard /> -->
    <div
      class="flex flex-col max-h-[600px] gap-5 items-center justify-center py-10 rounded-2xl custom-box-shadow dark:bg-slate-900">
      <div class="w-40 md:w-60 bg-gray-300 rounded-full shadow">
        <img referrerpolicy="no-referrer" :src="this.avatar" alt="Avatar"
          class="w-full aspect-square object-cover rounded-full" />
      </div>
      <p class="font-semibold text-3xl tracking-wide mx-5 mb-5 dark:text-white">
        {{ this.username }}
      </p>
      <div class="flex items-center">
        <ProfileStat :title="this.battles" description="Battles" />
        <div class="w-0.5 h-[60px] mx-3 rotate-180 bg-neutral-600 dark:bg-neutral-200"></div>
        <ProfileStat :title="this.wins" description="Wins" />
        <div class="w-0.5 h-[60px] mx-3 rotate-180 bg-neutral-600 dark:bg-neutral-200"></div>
        <ProfileStat :title="this.winrat" description="Win-rat" />
      </div>
      <div @click="this.friendTab = true"
        class="flex items-center h-[50px] px-3 justify-center text-gray-700 font-bold text-xl cursor-pointer bg-gray-200 rounded-lg shadow-lg">
        View Friends
      </div>
    </div>

    <!-- <LastBattlesCard /> -->
    <div class="flex flex-col max-h-[600px] items-center rounded-2xl custom-box-shadow dark:bg-slate-900">
      <div class="flex flex-col items-center w-full rounded-t-2xl gap-3 pt-3">
        <h1 class="font-semibold text-2xl dark:text-white">Last Battles</h1>
        <div class="w-full h-px bg-gray-800 dark:bg-neutral-300"></div>
      </div>
      <div class="overflow-y-auto w-full text-lg font-medium">
        <div v-if="!this.games.length" class="h-full flex flex-col items-center">
          <img src="../assets/imgs/empty2.png" alt="" class="aspect-square object-cover" />
          <p class="font-bold text-gray-400 text-2xl pb-20 md:pb-0 text-center">
            No Battles yet!!
          </p>
        </div>
        <div v-else v-for="(game, index) in this.games" :key="index"
          class="m-4 p-4 rounded-lg custom-box-shadow dark:bg-slate-800 dark:text-white">
          <div :class="[
            'mb-2',
            'font-bold',
            game.score.split(' ')[0] > game.score.split(' ')[2]
              ? 'text-green-500'
              : ' text-red-500',
          ]">
            {{ game.user1.username }} ({{ game.score.split(" ")[0] }})
          </div>
          <div :class="[
            'font-bold',
            game.score.split(' ')[0] < game.score.split(' ')[2]
              ? 'text-green-500'
              : ' text-red-500',
          ]">
            {{ game.user2.username }} ({{ game.score.split(" ")[2] }})
          </div>
        </div>
      </div>
    </div>

    <!-- <AchievementsCard /> -->
    <div class="md:col-span-2 flex flex-col">
      <h1 class="p-7 font-semibold text-4xl dark:text-white">Achievements:</h1>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
        <div v-for="(val, index) in achievements" :key="index"
          class="flex flex-col w-full items-center justify-center rounded-2xl mx-auto py-5 gap-2 custom-box-shadow dark:bg-slate-900 dark:text-white">
          <Icon class="text-gray-500 dark:text-gray-400" :icon="val.icon" height="80" />
          <h1 class="font-bold">{{ val.title }}</h1>
          <p class="text-gray-400">{{ val.desc }}</p>
          <div v-if="val.status" class="p-2 text-emerald-400 bg-green-700 bg-opacity-30 font-semibold rounded-md">
            Achieved
          </div>
          <div v-else class="p-2 text-red-400 bg-red-300 bg-opacity-30 font-semibold rounded-md">
            In progress
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
