<template>
  <div>
    <Icon
      class="text-black dark:text-white h-8 w-8 md:h-10 md:w-10 hover:bg-blue-400 p-1 rounded-md cursor-pointer"
      @click="openPopup"
      title="Channel Setting"
      icon="basil:edit-solid"
    />

    <div
      v-if="isOpend"
      class="fixed inset-0 flex items-center justify-center dark:bg-slate-800"
    >
      <div class="bg-white rounded-lg p-6 custom-box-shadow dark:bg-slate-900">
        <h2 class="text-xl font-bold mb-4">Update Channel:</h2>
        <div>
          <input
            v-model="ChannelName"
            @keyup.enter="sendMessage"
            placeholder="Channel Name"
            class="font-bold bg-gray-200 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
          />
          <div class="my-4">
            <label for="dropdown" class="mr-2">Privacy:</label>
            <select
              v-model="selectedOption"
              class="border dark:bg-slate-800 border-gray-300 px-4 py-2 rounded"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="protected">Protected</option>
            </select>
          </div>

          <input
            v-if="selectedOption == 'protected'"
            type="password"
            v-model="password"
            placeholder="Enter your new password"
            class="font-bold bg-gray-200 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
          />
          <p class="mt-2 text-sm text-red-600" v-if="message">Password is required</p>
        </div>
        <button
          @click="closePopup"
          class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
        <button
          v-if="selectedOption != '' && ChannelName != ''"
          @click="SaveChannel"
          class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { useUserStore } from "../../stores/state.ts";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  components: {
    Icon,
  },
  data() {
    return {
      ChannelName: "",
      selectedOption: "",
      password: "",
      isOpend: false,
      message: false,
    };
  },
  methods: {
    openPopup() {
      this.isOpend = true;
    },

    async SaveChannel() {
      if (this.selectedOption == "protected" && this.password == "") {
        this.message = "Password !!!!!";
        this.isOpend = true;
      } else {
        this.isOpend = false;
        //console.log(this.selectedOption);
        this.$socket.emit(
          "updateChatRoom",
          {
            chatId: this.userStore.ActiveChannelId,
            title: this.ChannelName,
            privacy: this.selectedOption,
            password: this.password,
          },
          () => {}
        );

        this.$socket.on("ChatRoomList", (data) => {
          //console.log(" this what hello ", data.type);
          //console.log(data);
        });

        this.ChannelName = "";
        this.password = "";
        this.selectedOption = "";
      }
      await this.userStore.fetchDataForDmChatRooms();
    },

    closePopup() {
      this.isOpend = false;
    },
  },
  mounted() {
    this.ChannelName = this.userStore.ActiveChannelTitle;
    //console.log("------------------", this.userStore.ActiveChannelId);
  },
};
</script>
