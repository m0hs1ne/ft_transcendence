<script>
import { RouterView } from "vue-router";
import Sidebar from "./components/NavBar/Sidebar.vue";
import Loading from "./components/Loading/Loading.vue";
import { SharedData } from "./stores/state.ts";
import axios from "axios";
import { useDark, useToggle } from '@vueuse/core';



export default {
  data() {
    return {
      twoFA: false,
      otpCode: "",
      error: "",
    };
  },
  setup(props) {
    const isDark = useDark();
    const toggleDark = useToggle(isDark);
    const state = SharedData();
    return { isDark, toggleDark, state };
  },
  methods: {
    isSidebarVisible() {
      const allowedPaths = [
        "/",
        "/chat",
        "/profile",
        "/search",
        "/setting",
        "/leaderboard",
      ];
      return allowedPaths.includes(this.$route.path);
    },


    routerGard() {
      const path = this.$route.path.toLowerCase();
      if (this.state.isLoggedIn && path == "/signin") this.$router.push("/");
      else if (!this.state.isLoggedIn && path != "/signin") this.$router.push("/signIn");
    },

    handleInput() {
      this.error = "";
      // Remove non-numeric characters
      this.otpCode = this.otpCode.replace(/\D/g, "");
    },

    async validate2FA() {
      try {
        console.log("otp code: ", this.otpCode)
        const response = await axios.post(
          "http://10.32.120.112:3000/api/2fa/authenticate/",
          { tfaCode: this.otpCode },
          {
            withCredentials: true,
          }
        );
        console.log("validate2FA res", response.data);
        if (response.data !== "Logged in") {
          this.error = response.data;
          return;
        }

        await axios.patch(
          "http://10.32.120.112:3000/api/users/profile/validsession/",
          {
            validSession: true,
          },
          {
            withCredentials: true,
          }
        );
        // Update the local state with the new avatar URL
        await this.state.fetchData();
        this.twoFA = false;
      } catch (error) {
        console.error("Error validate2FA:", error);
      }
    },


    async confirmLogout() {
      const tmp = this.isDark;
      const confirmed = window.confirm('Are you sure you want to log out?');
      if (confirmed) {
        try {
          await axios.get('http://10.32.120.112:3000/api/auth/logout', { withCredentials: true });
          this.twoFA = false;
          this.$router.push('/signIn');
        }
        catch (error) {
          console.log("logdout error: ", error)
        }
      }
    }

  },
  async mounted() {
    await this.state.fetchData();
    this.twoFA = this.state.userData.is2faEnabled && !this.state.userData.validSession;
    this.routerGard();
  },
  components: {
    Loading,
    Sidebar,
    RouterView,
  },
};
</script>

<template>
  <main class="font-Poppins">
    <div v-if="this.twoFA" class="m-auto flex items-center justify-center h-screen dark:bg-slate-800">
      <div
        class="flex flex-col gap-5 p-10 items-center justify-center w-4/5 md:w-[500px] rounded-2xl custom-box-shadow dark:bg-slate-900">
        <h2 class="flex w-full justify-start items-center py-5 px-10  font-light text-xl text-gray-500">
          Enter virifcation code from Google Authenticator app.
        </h2>
        <div class="flex flex-col justify-center items-center text-center">
          <input v-model="this.otpCode"
            class="bg-gray-200 shadow m-2 border h-10 w-full text-center rounded placeholder-gray-500" type="text"
            inputmode="numeric" maxlength="6" placeholder="******" @input="handleInput" />
          <p v-if="this.error" class="text-red-500 pb-5">
            {{ this.error }}
          </p>
          <p v-else class="text-red-500 pb-5">
            {{ this.otpCode.length < 6 ? "Code must be 6 digits" : "" }} </p>
              <div class="flex items-center justify-center w-full gap-5  font-medium">
                <button @click="this.validate2FA()" :disabled="this.otpCode.length < 6"
                  class="text-gray-100 dark:text-white shadow w-fit py-2 px-5 bg-blue-500 rounded-lg">
                  Submit
                </button>
                <button @click="this.confirmLogout()"
                  class="text-gray-100 dark:text-white shadow w-fit py-2 px-5 bg-gray-500 rounded-lg">
                  Logout
                </button>
              </div>
        </div>
      </div>
    </div>
    <Loading v-if="this.state.isLoading && !this.twoFA" />
    <Sidebar v-if="isSidebarVisible() && !this.state.isLoading && !this.twoFA" />
    <RouterView v-if="!this.state.isLoading && !this.twoFA" />
  </main>
</template>
