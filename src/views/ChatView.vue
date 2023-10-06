<template>
	<div class="flex min-h-screen bg-gray-100 ml-20 dark:bg-slate-800">
	  <!-- Friend List and Group List Section -->
	  <div class="">
		<div class="flex flex-col">
		  <ChatFriendList @object-sent="handleObject" />
		</div>
		<ChatAlertChannel/>
		<GroupList/>
	  </div>
  
	  <!-- Chat Box Section -->
	  <div class="flex-1 flex flex-col">
		<div class="border-b">
		  <!-- <component v-if="isTargetComponentVisible" :is="ChatChatbox" :received-prop="propToPass" /> -->
		  <ChatChatbox v-if="displayTargetComponent" :person="personObject" class="border-b-2" />
		</div>
		
	  </div>
	</div>
  </template>
  
  <script>
  import { ref } from "vue"
  const message = ref([]);
  import GroupList from './../components/Chat/GroupList.vue';
  import ChatChatbox from './../components/Chat/Chatbox.vue';
  import ChatFriendList from './../components/Chat/FriendList.vue';
  import ChatRoom from './../components/Chat/chatRoom.vue';
  
  
  export default {
	components: {
	  ChatFriendList,
	  ChatChatbox,
	  GroupList,
	  ChatRoom
	},
	data() {
	  return {
		displayTargetComponent: 0,
		targetComponent: null,
		personObject: {}
	  };
	},
  
	mounted() {
	  console.log(this.$socket.on);
	  this.$socket.on("notification", (messages) => {
		console.log(" this is notification ");
		console.log(message);
	  });
  
	  this.$socket.on("Error", (data) => {
		console.log("Event received Error: ", data);
	  });
	},
	methods: {
  
	  showAlert() {
		const message = 'This is an alert message.';
		this.$nuxt.$emit('showAlert', { message });
	  },
  
	  handleNotification(message) {
		console.log("I am here ");
	  },
	  handleObject(object) {
		console.log(this.displayTargetComponent, " ", object.id)
		if (object.id != this.displayTargetComponent) {
		  console.log(" I am here to ", object)
		  if (this.displayTargetComponent != 0) {
			this.displayTargetComponent = false;
			this.$nextTick(() => {
			  // Code here will be executed after the next DOM update cycle
			  console.log('DOM updated');
			  this.displayTargetComponent = object.id;
			  // Access or manipulate DOM elements here
			});
		  }
		  else
			this.displayTargetComponent = object.id;
		}
		this.personObject = object;
	  },
	},
  };
  </script>
  <style></style>
  