<template>
	<div class="flex bg-gray-200 h-screen ml-20 dark:bg-slate-800">
		<!-- Friend List and Group List Section -->
		<div class="basis-1/4">
			<!-- <GroupList @object-sent="handleObjectChannel" /> -->
			<ChatGroupFriend @object-sent="handleObject" />
			<ErrorPopup v-if = "this.userStore.error"/>
		</div>
		<div class="basis-3/4  ">
			<ChatChatbox v-if="displayTargetComponent" :person="personObject" class="border-b-2" />
			<ChatBoxChannel v-if="displayChatboxChannel" :channel="ChannelObject" />
		</div>
		<div class="basis-1/4">
			<ChatUserProfile :person="personObject" v-if="displayTargetComponent" />
			<ChatChannelProfil v-if="displayChatboxChannel" />
		</div>
	</div>
</template>
  
<script>

import ChatChatbox from '../components/Chat/Chatbox.vue';
import ChatFriendList from '../components/Chat/FriendList.vue';
import ChatRoom from '../components/Chat/chatRoom.vue';
import ChatBoxChannel from '../components/Chat/ChatBoxChannel.vue'
 import ChatGroupFriend from '../components/Chat/GroupFriend.vue';
import ChatChannelProfil from '../components/Chat/ChannelProfil.vue';
import ChatUserProfile from '../components/Chat/UserProfile.vue';
import ErrorPopup from '../components/Chat/ErrorPopup.vue';

import { useUserStore } from './../stores/state.ts';
export default {
	setup() {
		const userStore = useUserStore();
		return { userStore };
	},

	components: {
		ChatBoxChannel,
		ChatFriendList,
		ChatChatbox,
		ChatRoom,
		ChatGroupFriend,
		ChatUserProfile,
		ChatChannelProfil,
		ErrorPopup
	},
	data() {
		return {
			displayTargetComponent: 0,
			displayChatboxChannel: 0,
			targetComponent: null,
			personObject: {},
			ChannelObject: {},
			error:null
		};
	},


	methods: {
		handleNotification(message) {
			console.log("I am here ");
		},


		IsPerson(object) {
			console.log(object)
			// this.displayChatboxChannel = false;
			if (object.id != this.displayTargetComponent) {
				console.log(" I am here In person ", object)
				if (this.displayTargetComponent != 0 || this.displayChatboxChannel) {
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

		IsChannel(object) {
			console.log("This is an channel ", object)
			this.displayTargetComponent = false
			if (object.id != this.displayChatboxChannel) {
				console.log(" I am here to ", object, this.displayChatboxChannel)
				if (this.displayChatboxChannel) {
					this.displayTargetComponent = false;
					this.displayChatboxChannel = false;
					this.$nextTick(() => {
						// Code here will be executed after the next DOM update cycle
						console.log('DOM updated', object.id);
						this.displayChatboxChannel = object.id;
						// Access or manipulate DOM elements here
					});
				}
				else
					this.displayChatboxChannel = object.id;
			}
			this.ChannelObject = object;
		},

		handleObject(object) {
			if (object.username)
				this.IsPerson(object)
			else
				this.IsChannel(object)
			//IsChannel(object)
		},
	},

	async mounted() {

		// this.$socket.on("Notification", (messages) => {
		// 	console.log("this is notification------------------");
		// 	console.log(messages);
		// 	this.userStore.UpdateInvitaion(messages);
		// 	messages.notifications.forEach((element) => {
		// 		if (element.type == "invitations") {
		// 			console.log("elements: ", element);
		// 			console.log("update notifications")
		// 		}
		// 	});
		// });
		 this.$socket.on("receiveMessage", (data) => {
			console.log("data from ", data)
			if (data.type != 'DMMessages')
			{
				console.log("I am here: ")    
				//this.userStore.fetchDataForDmChatRooms();
			}
			  if (data.action == 'kick' && data.from.id == this.userStore) {
				console.log(" kicked >>>>>>>>")
				this.$nextTick(() => {
					this.displayTargetComponent = false;
					this.displayChatboxChannel = false;
					
					});
				this.userStore.fetchDataForDmChatRooms();
			    }
		})

		 this.$socket.on("ChatRoomList", (data) => {

			if (data.type == 'remove')
			{
				console.log("Rmovee >>>>>> ")
				// this.$nextTick(() => {
				// 	this.displayTargetComponent = false;
				// 	this.displayChatboxChannel = false;
				// 	});
				this.userStore.fetchDataForDmChatRooms();
			}
		});


		this.$socket.on("Error", (data) => {
			console.log(" Error ",data)
			this.error = data.error,
			this.userStore.error = data.error;
		});

	},
};
</script>
<style></style>
  