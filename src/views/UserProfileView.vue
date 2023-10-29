<script>
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import Loading from "../components/Loading/Loading.vue";
import axios from "axios";
import ProfileStat from "./../components/Profile/ProfileStat.vue";
import { SharedData, useUserStore } from "./../stores/state.ts";

export default {
  setup(props) {
    const state = SharedData();
    const isError = ref(false);
    const isLoading = ref(false);
    const chatApi = useUserStore();
    const username = ref("");
    const avatar = ref("");
    const wins = ref(0);
    const losses = ref(0);
    const battles = ref(0);
    const winrat = ref(0);
    const games = ref([]);
    const friends = ref([]);
    const is2FA = ref(false);
    const isNotMe = ref(false);
    const isFriend = ref(false);
    const isBlocked = ref(false);
    const isBlockedBy = ref(false);
    const friendTab = ref(false);
    const userData = ref({});
    const achievements = ref([]);

    return {
      isLoading,
      isError,
      username,
      avatar,
      wins,
      games,
      achievements,
      battles,
      winrat,
      isNotMe,
      state,
      isFriend,
      chatApi,
      friendTab,
      userData,
      isBlocked,
      isBlockedBy,
    };
  },
  components: {
    ProfileStat,
    Icon,
    Loading,
  },
  methods: {
    setAchievments() {
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

    async fetchData() {
      this.isError = false;
      this.isNotMe = this.state.userData.id != this.$route.params.id;
      this.isLoading = true;
      // Get user profile data
      try {
        const res = await axios.get(
          `http://10.32.125.38:3000/api/users/profile/${this.$route.params.id}`,
          {
            withCredentials: true,
          }
        );


        this.userData = res.data;
        this.username = res.data.username;
        this.avatar = res.data.avatar;
        this.wins = res.data.wins - 1;
        this.losses = res.data.losses - 1;
        this.battles = res.data.wins + res.data.losses - 2;
        this.winrat =
          parseInt((res.data.wins / (res.data.wins + res.data.losses)) * 100) + "%";
        this.friends = res.data.friends;
        this.games = res.data.games;
        this.isFriend = this.state.friends.some((user) => user.id === res.data.id);
        this.isBlocked = this.state.blocked.some((user) => user.id === res.data.id);
        this.isBlockedBy = this.state.blockedBy.some((user) => user.id === res.data.id);
        this.is2FA = res.data.is2faEnabled;
        this.setAchievments();
        console.log("user from id: \n", res.data);
      } catch (error) {
        console.log("Getting user profile error\n", error);
        this.isError = true;
      }
      this.isLoading = false;
    },

    async friendLogic() {
      this.isError = false;
      this.isLoading = true;
      try {
        if (this.isFriend) {
          const response = await axios.delete(
            `http://10.32.125.38:3000/api/users/friends/${parseInt(this.$route.params.id)}`,
            {
              withCredentials: true,
            }
          );
          console.log("1 friendLogic res", response);
        } else {
          const response = await axios.post(
            "http://10.32.125.38:3000/api/users/friends/",
            { id: parseInt(this.$route.params.id) },
            {
              withCredentials: true,
            }
          );
          console.log("2 friendLogic res", response);
        }
      } catch (error) {
        console.error("Error friendLogic:", error);
        this.isError = true;
      }
      this.isLoading = false;
    },
    async unBlock() {
      this.isError = false;
      this.isLoading = true;

      try {
        const response = await axios.delete(
          `http://10.32.125.38:3000/api/users/blocked/${parseInt(this.$route.params.id)}`,
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error unBlock:", error);
        this.isError = true;
      }
      this.isLoading = false;
    },
    goToChat() {
      // this.chatApi.ActiveId = this.userData;
      // this.chatApi.viewMode = 'Chat';
      this.$router.push("/chat");
    },
  },

  async mounted() {
    await this.fetchData();
    this.$socket.on("Notification", async (data) => {
      if (data.type === "updated") {
        this.isLoading = true;
        this.isError = false;
        try {
          await this.state.updateData();
          this.isFriend = this.state.friends.some((user) => user.id === this.userData.id);
          this.isBlocked = this.state.blocked.some((user) => user.id === this.userData.id);
          this.isBlockedBy = this.state.blockedBy.some((user) => user.id === this.userData.id);
        } catch (error) {
          this.isLoading = false;
          this.isError = true;
        }
        this.isLoading = false;
      }
    });
  },
  async updated() {
    if (this.userData.id != this.$route.params.id && !this.isError) {
      await this.fetchData();
    }
  },
};
</script>

<template>
  <Loading v-if="this.isLoading" />
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
  <div v-else-if="this.friendTab"
    class="flex flex-col justify-start items-center ml-20 lg:ml-24 min-h-screen dark:bg-slate-800 p-10">
    <div class="flex w-full justify-center items-center pb-10">
      <Icon @click="this.friendTab = false" icon="ion:arrow-back"
        class="text-gray-100 h-16 w-16 dark:text-white p-3 cursor-pointer" />
      <h1 class="font-semibold text-3xl md:text-4xl dark:text-white text-center items-center overflow-ellipsis">
        {{ this.username }} Friends:
      </h1>
    </div>
    <div v-if="!this.friends.length" class="h-full flex flex-col items-center">
      <img src="../assets/imgs/empty2.png" alt="" class=" aspect-square object-cover">
      <p class="font-bold text-gray-400 text-2xl pb-20 md:pb-0 text-center">
        lonely 😔
      </p>
    </div>
    <div v-for="(element, index) in this.friends" :key="index"
      class="flex items-center justify-start w-full max-w-[500px] my-2 px-5 py-3 rounded-2xl custom-box-shadow dark:bg-slate-700 dark:text-white">
      <router-link @click="this.friendTab = false" :to="'/users/' + element.id"
        class="flex items-center justify-between min-w-full">
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

  <div v-else class="grid grid-cols-1 ml-20 lg:ml-24 md:grid-cols-2 gap-10 p-10 min-h-screen dark:bg-slate-800">
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
      <div class="flex w-full items-center justify-center gap-5">
        <div v-if="this.isNotMe && !this.isBlocked && !this.isBlockedBy"
          class="flex items-center justify-center font-bold text-xl cursor-pointer">
          <Icon @click="this.friendLogic()" :icon="!this.isFriend ? 'bi:person-fill-add' : 'bi:person-fill-x'" height="50"
            class="text-gray-100 dark:text-white shadow w-fit p-3 bg-blue-500 hover:bg-blue-300  rounded-lg" />
        </div>
        <div v-if="this.isNotMe && this.isFriend && !this.isBlocked && !this.isBlockedBy"
          class="flex items-center justify-center font-bold text-xl cursor-pointer">
          <Icon @click="this.goToChat()" icon="fluent:chat-12-filled" height="50"
            class="text-gray-100 dark:text-white shadow w-fit p-3 bg-blue-500 hover:bg-blue-300 rounded-lg" />
        </div>
        <div v-if="this.isBlocked && !this.isBlockedBy" @click="this.unBlock"
          class="flex items-center h-[50px] px-3 justify-center text-gray-700 font-bold text-xl cursor-pointer bg-gray-200 hover:bg-blue-300 rounded-lg shadow-lg">
          UnBlock
        </div>
        <div v-if="this.isBlockedBy"
          class="flex items-center h-[50px] px-3 justify-center font-bold text-xl bg-gray-200 rounded-lg shadow-lg">
          You're Blocked
        </div>
        <div v-else @click="this.friendTab = true"
          class="flex items-center h-[50px] px-3 justify-center text-gray-700 font-bold text-xl cursor-pointer bg-gray-200 hover:bg-blue-300 rounded-lg shadow-lg">
          View Friends
        </div>
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
          <img src="../assets/imgs/empty2.png" alt="" class=" aspect-square object-cover">
          <p class="font-bold text-gray-400 text-2xl pb-20 md:pb-0 text-center">
            No Battles yet!!
          </p>
        </div>
        <div v-else v-for="(game, index) in this.games" :key="index"
          class="m-4 p-4 rounded-lg custom-box-shadow dark:bg-slate-800 dark:text-white">
          <div :class="[
            'mb-2',
            'font-bold',
            parseInt(game.score.split(' ')[0]) > parseInt(game.score.split(' ')[2])
              ? 'text-green-500'
              : ' text-red-500',
          ]">
            {{ game.user1.username }} ({{ game.score.split(" ")[0] }})
          </div>
          <div :class="[
            'font-bold',
            parseInt(game.score.split(' ')[0]) < parseInt(game.score.split(' ')[2])
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
