<template>
	<div class="flex h-screen ml-20 dark:bg-slate-800 p-5 text-gray-700">
		<ChatGroupFriend v-if="this.userStore.screenWidth >= 768 || this.userStore.viewMode === 'List'"
			@object-sent="handleObject" />

		<div v-if="this.userStore.screenWidth >= 768 ||
			this.userStore.viewMode === 'Chat' ||
			this.userStore.viewMode === 'Channel'
			" class="w-full h-full flex flex-col dark:bg-slate-900 mx-5 custom-box-shadow dark:text-white rounded-xl">
			<ErrorPopup v-if="this.userStore.error" />
			<ChatChatbox v-if="displayTargetComponent" :person="personObject" />
			<ChatBoxChannel v-if="displayChatboxChannel && this.userStore.viewMode === 'Chat'" :channel="ChannelObject" />
			<ChatChannelProfil v-if="displayChatboxChannel && this.userStore.viewMode === 'Channel'" />
		</div>
	</div>
</template>

<script>
import ChatChatbox from "../components/Chat/Chatbox.vue";
import ChatFriendList from "../components/Chat/FriendList.vue";
import ChatRoom from "../components/Chat/chatRoom.vue";
import ChatBoxChannel from "../components/Chat/ChatBoxChannel.vue";
import ChatGroupFriend from "../components/Chat/GroupFriend.vue";
import ChatChannelProfil from "../components/Chat/ChannelProfil.vue";
import ChatUserProfile from "../components/Chat/UserProfile.vue";
import ErrorPopup from "../components/Chat/ErrorPopup.vue";
import ConfirmPlay from "../components/Chat/ConfirmPlay.vue";

import { useUserStore } from "./../stores/state.ts";
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
		ErrorPopup,
		ConfirmPlay,
	},
	data() {
		return {
			displayTargetComponent: 0,
			displayChatboxChannel: 0,
			targetComponent: null,
			personObject: {},
			ChannelObject: {},
			error: null,
		};
	},
	computed: {
		// Computed property to track the screen width
		updateScreenWidth() {
			
			return () => {
				if (window.innerWidth <= 768 && this.userStore.activeChatId == -1) {
					this.userStore.viewMode = "List";
				}
				this.userStore.screenWidth = window.innerWidth;
			};
		},
	},

	methods: {
		viewModesTracker() {
			// if width is small
		},

		IsPerson(object) {
			console.log(object);
			// this.displayChatboxChannel = false;
			if (object.id != this.displayTargetComponent) {
				// console.log(" =========================== ", this.displayChatboxChannel);
				if (this.displayChatboxChannel) this.displayChatboxChannel = 0;
				if (this.displayTargetComponent != 0 || this.displayChatboxChannel) {
					this.displayTargetComponent = false;
					this.$nextTick(() => {
						// Code here will be executed after the next DOM update cycle
						console.log("DOM updated", object.id);
						this.displayTargetComponent = object.id;
						// Access or manipulate DOM elements here
					});
				} else this.displayTargetComponent = object.id;
			}
			this.personObject = object;
		},

		IsChannel(object) {
			console.log("This is an channel ", object);
			this.displayTargetComponent = false;

			if (this.displayChatboxChannel) {
				this.displayTargetComponent = false;
				this.displayChatboxChannel = false;
				this.$nextTick(() => {
					console.log("DOM updated", object.id);
					this.displayChatboxChannel = object.id;
				});
			} else this.displayChatboxChannel = object.id;

			this.ChannelObject = object;
		},

		handleObject(object) {
		
			// console.log(this.userStore.ItemClicked)
			 if(!object.id && this.userStore.ItemClicked)
			 {
				console.log("I+++++++++++++++++++++++++++++++ ", object)
				object = this.userStore.ItemClicked;
				
			 }
			if (object.username) this.IsPerson(object);
			else this.IsChannel(object);

			//IsChannel(object)
		},
	},

	async mounted() {
		// Attach an event listener to the window resize event
		window.addEventListener("resize" , this.updateScreenWidth);

		// Ensure that the screen width is updated initially
		this.updateScreenWidth();

		this.$socket.on("receiveMessage", (data) => {
		

			if (data.action == "kick") {
				console.log(" kicked >>>>>>>>");
				if (data.from.id == this.userStore.MyId) {
					this.$nextTick(() => {
						this.displayTargetComponent = false;
						this.displayChatboxChannel = false;
					});
				}
				this.userStore.fetchDataForDmChatRooms();
			}
		});
        console.log("window W: " ,window.innerWidth);
		this.$socket.on("receiveMessage", (data) => {
			//console.log("data from ", data);
		//	console.log(this.userStore.ActiveChannelId);
			if (data.type != "error") {
				console.log("I am here: ");
				//this.userStore.fetchDataForDmChatRooms();
			}
			if (data.action == "kick") {
				console.log(" kicked >>>>>>>>");
				if (data.from.id == this.userStore.MyId) {
					this.$nextTick(() => {
						this.displayTargetComponent = false;
						this.displayChatboxChannel = false;
					});
				}
				this.userStore.fetchDataForDmChatRooms();
			}
		});

		this.$socket.on("ChatRoomList", (data) => {
			if (data.type == "remove") {
				console.log("Rmovee >>>>>> ");
				// this.$nextTick(() => {
				// 	this.displayTargetComponent = false;
				// 	this.displayChatboxChannel = false;
				// 	});
				this.userStore.fetchDataForDmChatRooms();
			}
		});

		this.$socket.on("Error", (data) => {
			console.log(" Error ", data);
			(this.error = data.error), (this.userStore.error = data.error);
		});
	},
	beforeUnmount() {
		// Remove the event listener when the component is unmounted
		console.log("this.updateScreenWidth ====> ", this.updateScreenWidth)
		window.removeEventListener("resize", this.updateScreenWidth);
	},
};
</script>
<style></style>
