<!-- FriendListComponent.vue -->
<template>
  <div class=" m-2 p-5 rounded-lg bg-slate-300">
    <ChatAlertChannel />
      <ul class="">
        <li v-for="friend in friends" :key="friend.id"
          class="collection-item collection-item-avatar flex items-center p-2 space-x-4 border-b"
          @click="handleChannelClick(friend)"
          >
          <div class="flex-shrink-0">
            <img src="https://cdn1.iconfinder.com/data/icons/developer-set-2/512/users-512.png"
                    alt="Avatar" class=" h-12 rounded-full" />
            <div class="status text-xs py-1 px-2 rounded-full capitalize" :class="{
              'bg-green-500 text-white': friend.status === 'Online',
              'bg-red-500 text-white': friend.status === 'Offline',
            }">
              {{ friend.status }}
            </div>
          </div>
          <div class="flex-grow">
            <span class="text-lg font-semibold">{{ friend.title }}</span>
            <p class="text-sm text-gray-500">{{ friend.lastmessage }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      friends: [
        // Add more friend objects here
      ],
    };
  },
  methods: {
    fetchData() {
         this.$socket.emit("findAllChatRooms", {}, () => {});
          this.$socket.on("ChatRoomList",(data)=>{
          console.log( "This is length",this.friends.length)
          if(data.type == 'new')
          {
            console.log("i am new channel");
            console.log(data)
            this.friends.push({
                title: data.chatroom.title,
              });
          }
          if(data.type == 'all')
          {

            data.chatrooms.forEach((element) => {
              this.friends.push({
                // id: Date.now(),
                title: element.title,
                id:element.id,
              }); 
            });
          }
        });
        console.log( "This is length",this.friends.length)
    },
    handleChannelClick(Item) {
      // Your click event logic here
      console.log("Prop emitd Group list ", Item);
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

