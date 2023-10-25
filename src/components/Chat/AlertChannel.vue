<template>
  <Icon @click="openPopup" title="Creat Channel" class="h-8 w-8" icon="mdi:group-add" />

  <div v-if="isOpend" class="fixed inset-0 flex items-center justify-center bg-black">
    <div class="bg-white rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4">Create Channel:</h2>
      <div>
        <input v-model="ChannelName" @keyup.enter="sendMessage" placeholder="Channel Name "
          class="m-1 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
        <p class="mt-2 text-sm text-red-600" v-if="ChannelName.length > 8">
          May isala7ch
        </p>
        <div class="mt-4">
          <label for="dropdown" class="mr-2">Privacy:</label>
          <select id="dropdown" v-model="selectedOption" class="bg-white border border-gray-300 px-4 py-2 rounded">
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="protected">Protected</option>
          </select>
        </div>

        <input v-if="selectedOption == 'protected'" type="password" v-model="password" placeholder="Enter your password"
          class="m-1 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10" />
        <p class="mt-2 text-sm text-red-600" v-if="message">
          Password is required
        </p>
      </div>
      <button @click="closePopup" class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Close
      </button>
      <button v-if="selectedOption != '' && ChannelName.length <= 8 != ''" @click="SaveChannel"
        class="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { useUserStore } from '../../stores/state.ts';

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
      title : false
    };
  },
  components: {
    Icon
  },
  methods: {
    openPopup() {
      this.isOpend = true;
    },

    SaveChannel() {
      if (this.selectedOption == "protected" && this.password == '') {
        this.message = "Password !!!!!"
        this.isOpend = true;
      }
      else {
        this.isOpend = false;
        console.log(this.selectedOption);
        this.$socket.emit("createChatRoom",
          {
            title: this.ChannelName,
            privacy: this.selectedOption,
            password: this.password
          }, () => { });

        this.$socket.on("ChatRoomList", (data) => {
          console.log(" this what hello ")
          console.log(data)

        });


        this.ChannelName = '';
        this.password = '';
        this.selectedOption = '';

      }
    },

    closePopup() {
      this.isOpend = false;
    },
  },
};
</script>
