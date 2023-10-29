<script>
import { RouterView } from "vue-router";
import Sidebar from "./components/NavBar/Sidebar.vue";
import ConfirmPlay from "./components/Chat/ConfirmPlay.vue";
import Loading from "./components/Loading/Loading.vue";
import { SharedData } from "./stores/state.ts";
import axios from "axios";
import { useDark, useToggle } from "@vueuse/core";

export default {
  data() {
    return {
      isLoggedIn: false,
      isError: false,
      isLoading: false,
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
      const path = this.$route.path.toLowerCase();
      return path != "/signin" && path != '/play';
    },

    routerGard() {
      const path = this.$route.path.toLowerCase();
      if (this.isLoggedIn && path == "/signin") this.$router.replace("/");
      else if (!this.isLoggedIn && path != "/signin")
        this.$router.replace("/signIn");
    },

    handleInput() {
      this.error = "";
      // Remove non-numeric characters
      this.otpCode = this.otpCode.replace(/\D/g, "");
    },

    async authState() {
      try {
        const res = await axios.get("http://10.32.120.112:3000/api/auth/success/", {
          withCredentials: true,
        });
        console.log("auth state res: ", res)
        this.isLoggedIn = true;
      } catch (error) {
        this.isLoggedIn = false;
      }
      console.log("authState isLoggedIN", this.isLoggedIn);
    },

    async fetchData() {
      this.isError = false;
      this.isLoading = true;
      try {
        await this.authState();
        console.log("0")

        if (this.isLoggedIn) {
          console.log("1")
          const res = await axios.get(
            "http://10.32.120.112:3000/api/users/profile/",
            {
              withCredentials: true,
            },
          );
          console.log("2")

          console.log("fetchData res: ", res);
          this.state.userData = res.data;
          this.state.friends = res.data.friends;
          this.state.blocked = res.data.blocked;

          // if (res.data.loggedFirstTime) {
          //   await axios.patch(
          //     "http://localhost:3000/api/users/profile/update/",
          //     {
          //       loggedFirstTime: false,
          //     },
          //     {
          //       withCredentials: true,
          //     }
          //   );
          //   this.$router.replace("/setting");
          // }
        }
      } catch (error) {
        console.log("Getting user profile error\n", error);
      }
      this.isLoading = false;
    },

    async validate2FA() {
      try {
        console.log("otp code: ", this.otpCode);
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

        this.twoFA = false;
      } catch (error) {
        console.error("Error validate2FA:", error);
        this.isError = true;
      }
    },

    async confirmLogout() {
      const tmp = this.isDark;
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        try {
          await axios.get("http://10.32.120.112:3000/api/auth/logout", {
            withCredentials: true,
          });
          this.twoFA = false;
          this.$socket.disconnect();
          this.$router.push("/signIn");
        } catch (error) {
          console.log("logdout error: ", error);
          this.isError = true;
        }
      }
    },
  },

  async mounted() {
    console.log("mounted in app.vue");
    await this.fetchData();
    this.twoFA = this.state.userData.is2faEnabled && !this.state.userData.validSession;
    this.routerGard();

    this.$socket.on("Notification", async (data) => {
      if (data.type === "updated") {
        console.log("-------------------------:  update notification");
        await this.fetchData();
      }
    });
  },
  components: {
    Loading,
    Sidebar,
    RouterView,
    ConfirmPlay,
  },
};
</script>

<template>
  <main class="font-Poppins dark:bg-slate-800">
    <div v-if="this.isError" class="flex items-center justify-center h-screen dark:bg-slate-800 p-10">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Opps!!</h1>
        <p class="text-lg text-gray-600 mt-4 mx-20 lg:mx-40 dark:text-gray-400">
          Something went wrong. feel free to contact us if the problem presists.
        </p>
        <div class="flex gap-5 items-center justify-center w-full">
          <button @click="this.$router.push('/')" class="mt-8 text-blue-500 hover:underline text-lg">Go to Home</button>
          <button @click="this.isError = false" class="mt-8 text-blue-500 hover:underline text-lg">Refresh</button>
        </div>
      </div>
    </div>
    <div v-else-if="this.twoFA" class="m-auto flex items-center justify-center h-screen dark:bg-slate-800">
      <div
        class="flex flex-col gap-5 p-10 items-center justify-center w-4/5 md:w-[500px] rounded-2xl custom-box-shadow dark:bg-slate-900">
        <h2 class="flex w-full justify-start items-center py-5 px-10 font-light text-xl text-gray-500">
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
              <div class="flex items-center justify-center w-full gap-5 font-medium">
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
    <Loading v-if="this.isLoading && !this.twoFA" />
    <Sidebar v-if="isSidebarVisible() && !this.isLoading && !this.twoFA" />
    <RouterView v-if="!this.isLoading && !this.twoFA" />
    <ConfirmPlay />
  </main>
</template>
