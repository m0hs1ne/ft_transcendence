<template>
	<div class="flex bg-gray-200 h-screen ml-20 dark:bg-slate-800">
		<!-- Friend List and Group List Section -->
		<div class="flex flex-col h-screen basis-1/4 overflow-y-scroll">
			<!-- <GroupList @object-sent="handleObjectChannel" /> -->
			<ChatGroupFriend @object-sent="handleObject" />
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
import GroupList from '../components/Chat/GroupList.vue';
import ChatChatbox from '../components/Chat/Chatbox.vue';
import ChatFriendList from '../components/Chat/FriendList.vue';
import ChatRoom from '../components/Chat/chatRoom.vue';
import ChatBoxChannel from '../components/Chat/ChatBoxChannel.vue'
import ChatGroupFriend from '../components/Chat/GroupFriend.vue';
import ChatChannelProfil from '../components/Chat/ChannelProfil.vue';
import ChatUserProfile from '../components/Chat/UserProfile.vue';

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
		GroupList,
		ChatRoom,
		ChatGroupFriend,
		ChatUserProfile,
		ChatChannelProfil

	},
	data() {
		return {
			displayTargetComponent: 0,
			displayChatboxChannel: 0,
			targetComponent: null,
			personObject: {},
			ChannelObject: {},
		};
	},


	methods: {
		handleNotification(message) {
			console.log("I am here ");
		},


		IsPerson(object) {
			console.log(object)
			this.displayChatboxChannel = false;
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

		IsChannel(object) {
			console.log("This is an channel " ,object )
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

	mounted() {

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
		this.$socket.on("Error", (data) => {
			console.log("Error ", data)
		});

	},
};
</script>
<style></style>
  