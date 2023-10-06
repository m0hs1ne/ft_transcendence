<!-- FriendListComponent.vue -->
<template>
  <div class="m-2 p-5 max-h-1.2 rounded-lg bg-slate-300">
    <div class="h-1/2">
      <ul class=" w-1/2 h-1/2 ">
        <li v-for="friend in friends" :key="friend.id"
          class="collection-item collection-item-avatar flex items-center p-2 space-x-4 border-b"
         >
          <div class="flex-shrink-0">
            <img :src="friend.avatar"  @click="handleChatClick(friend)"  alt="Avatar" class=" h-12 rounded-full" />
            <div class="status text-xs py-1 px-2 rounded-full capitalize" :class="{
              'bg-green-500 text-white': friend.status === 'Online',
              'bg-red-500 text-white': friend.status === 'Offline',
            }">
              {{ friend.status }}
            </div>
          </div>
          <div class="flex-grow">
            <span class="text-lg font-semibold">{{ friend.username }}</span>
            <p class="text-sm text-gray-500">{{ friend.lastmessage }}</p>
          </div>
        
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      friends: [
        {
        },
        // Add more friend objects here
      ],
    };
  },
  methods: {
    fetchData() {
      axios
        .get("http://localhost:3000/api/users/friends/", { withCredentials: true })
        .then((response) => {
          this.responseData = response.data;
          this.friends = this.responseData.friends
          console.log(" i am here ", this.responseData.friends);
          console.log(this.friends)

        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    handleChatClick(Item) {
      // Your click event logic here
      console.log("Prop emitd ");
      // console.log(Item)
      this.$emit('object-sent', Item);
    },
  
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
/* Add your CSS styling here */
</style>
