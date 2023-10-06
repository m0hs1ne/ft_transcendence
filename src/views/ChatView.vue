<template>
	<div class="flex bg-gray-200 h-screen ml-20 dark:bg-slate-800">
	  <!-- Friend List and Group List Section -->
	  <div class="flex flex-col h-screen basis-1/4 overflow-y-scroll">
		  <!-- <GroupList @object-sent="handleObjectChannel" /> -->
		  <ChatGroupFriend @object-sent="handleObject"/>
	  </div>
	  <div class="basis-3/4  ">
		<!-- <ChatChatbox v-if="displayTargetComponent" :person="personObject" class="border-b-2" />
		<ChatBoxChannel v-if="displayChatboxChannel" :channel="ChannelObject"/> -->
	  </div>
	  <div class="basis-1/4">
		<!-- <ChatUserProfile :person="personObject" v-if="displayTargetComponent"/>
		<ChatChannelProfil v-if="displayChatboxChannel"  :Channeldetails="members" @o-sent="han" /> -->
	
	  </div>
	</div>
  </template>
  
  <script>
  import GroupList from '../components/Chat/GroupList.vue';
  import ChatChatbox from '../components/Chat/Chatbox.vue';
  import ChatFriendList from '../components/Chat/FriendList.vue';
  import ChatRoom from '../components/Chat/chatRoom.vue';
  import ChatBoxChannel from '../components/Chat/ChatBoxChannel.vue'
  import  ChatGroupFriend  from '../components/Chat/GroupFriend.vue';
  import ChatChannelProfil from'../components/Chat/ChannelProfil.vue';
  export default {
	components: {
	  ChatBoxChannel,
	  ChatFriendList,
	  ChatChatbox,
	  GroupList,
	  ChatRoom,
	  ChatGroupFriend,
	  ChatChannelProfil
  
	},
	data() {
	  return {
		displayTargetComponent: 0,
		displayChatboxChannel:0,
		targetComponent: null,
		personObject: {},
		ChannelObject:{},
	 
	  };
	},
  
  
	methods: {
	  handleNotification(message) {
		console.log("I am here ");
	  },
  
  
	  IsPerson(object)
	  {
		console.log( object)
		if (object.id != this.displayTargetComponent) {
		  console.log(" I am here to ", object)
		  if (this.displayTargetComponent != 0) {
			this.displayTargetComponent = false;
			this.$nextTick(() => {
			  // Code here will be executed after the next DOM update cycle
			  console.log('DOM updated', object.id);
			  this.displayTargetComponent = object.id; 
			  // Access or manipulate DOM elements here
			});
		  }
		  else
			this.displayTargetComponent = object.id;
		}
		this.personObject = object;
	  },
	
	  IsChannel(object)
	  {
		// this.displayChatboxChannel == object.id && !object.username ) || (this.displayChatboxChannel != object.id  && this.displayChatboxChannel != 0 )
		if ((this.displayTargetComponent))
		{
			this.displayChatboxChannel = false;
			this.$nextTick(() => {
			  console.log('DOM updated for channel obj 111', object.id);
			  this.displayTargetComponent = 0;
			  this.displayChatboxChannel = object.id;
			});
		  }
		  else
		  {
			this.displayTargetComponent = 0;
			this.displayChatboxChannel = object.id;
		  }
	//    console.log(" display chat box channel " ,this.displayChatboxChannel)
		this.ChannelObject = object;
	   // console.log(" This is obj: ", this.object)
		//this.displayTargetComponent = object.id;
		if(this.displayChatboxChannel)
		{
		  console.log("From here ")
		  this.han(object)
		}
	  },
   
	  handleObject(object) {
		if(object.username)
		  this.IsPerson(object)
		else
		  this.IsChannel(object)
		//IsChannel(object)
	  },
	  han(obj)
	  {
		console.log("This************* ", obj)
	  }
	},
  
	mounted() {
	  this.$socket.on("notification", (messages) => {
		console.log(" this is notification ");
		console.log(message);
	  });
  
	  this.$socket.on("Error", (data) => {
	  });
	
	},
  };
  </script>
  <style></style>
  