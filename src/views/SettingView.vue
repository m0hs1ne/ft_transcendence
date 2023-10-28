<script>
import { ref } from "vue";
import { SharedData } from "./../stores/state.ts";
import { useDark, useToggle } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import axios from "axios";

export default {
	data() {
		return {
			username: String,
			avatar: String,
			selectedFile: null,
			newName: "",
			is2FA: false,
			otpCode: "",
			currentCard: 0,
			error: '',
		};
	},
	setup(props) {
		const isDark = useDark();
		const toggleDark = useToggle(isDark);
		const state = SharedData();
		return { state, isDark, toggleDark };
	},
	methods: {

		// For Info Card
		async updateAvatar(event) {
			this.state.isLoading = true;
			this.selectedFile = event.target.files[0];
			console.log("selectedFile: ", this.selectedFile);
			try {
				// Check if a file is selected
				if (!this.selectedFile) {
					console.error("No file selected.");
					return;
				}

				// Create a FormData object to send the file
				const formData = new FormData();
				formData.append("file", this.selectedFile, this.selectedFile.name);

				// Replace 'http://10.32.120.112:3000/api/users/upload_avatar/' with your server-side endpoint
				const response = await axios.post(
					"http://10.32.120.112:3000/api/users/upload_avatar/",
					formData,
					{
						withCredentials: true,
					}
				);

			} catch (error) {
				console.error("Error updating avatar:", error);
			}
			this.state.isLoading = false;
		},
		async updateName() {
			if (this.newName.length < 3 || this.newName.length > 12) {
				return;
			}
			try {
				// Make a PATCH request to update the username
				const response = await axios.patch(
					"http://10.32.120.112:3000/api/users/profile/update/",
					{
						username: this.newName,
					},
					{
						withCredentials: true,
					}
				);

				if (response.data.result)
				{
					this.error = response.data.message;
					return;
				}

				// Update the local state with the new avatar URL
				// this.changeCard(0);
				console.log("respone of updatename: ", response);
			} catch (error) {
				this.error = error;
				console.error("Error updateName:", error);
			}
		},

		// For Enbling and daisbing 2FA
		handleInput() {
			this.error = "";
			// Remove non-numeric characters
			if (this.otpCode)
				this.otpCode = this.otpCode.replace(/\D/g, "");
		},

		async enable2FA() {
			try {
				const response = await axios.post(
					"http://10.32.120.112:3000/api/2fa/turn-on/",
					{ tfaCode: this.otpCode },
					{
						withCredentials: true,
					}
				);
				console.log("enable2FA res", response.data.message);
				if (response.data.message !== "2fa is now enabled") {
					this.error = response.data.message;
					return;
				}

				// Update the local state with the new avatar URL
				await axios.get('http://10.32.120.112:3000/api/auth/logout', { withCredentials: true });
				this.$socket.disconnect();
				this.$router.push('/signIn');
			} catch (error) {
				console.error("Error enable2FA:", error);
			}
		},
		async disable2FA() {
			try {
				const response = await axios.post(
					"http://10.32.120.112:3000/api/2fa/turn-off/",
					{ tfaCode: this.otpCode },
					{
						withCredentials: true,
					}
				);
				console.log("disable2FA res", response.data.message);
				if (response.data.message !== "2fa is now disabled") {
					this.error = response.data.message;
					return;
				}

				this.changeCard(0);
			} catch (error) {
				console.error("Error disable2FA:", error);
			}
		},

		// Shared Function
		changeCard(card) {
			this.error = "";
			this.currentCard = card;
		},
	},
	components: {
		Icon,
	},
	mounted() {
		this.username = this.state.userData.username;
		this.avatar = this.state.userData.avatar;
		this.is2FA = this.state.userData.is2faEnabled;
	},
};
</script>

<template>
	<div class="m-auto flex items-center justify-center h-screen ml-20 lg:ml-24 dark:bg-slate-800">
		<!-- Info Card -->
		<div v-if="this.currentCard == 0"
			class="flex flex-col gap-5 items-center justify-center w-4/5 md:w-[500px] py-20 rounded-2xl custom-box-shadow dark:bg-slate-900">
			<div></div>
			<label class="relative w-36 h-36 bg-gray-300 rounded-full shadow-lg cursor-pointer">
				<img referrerpolicy="no-referrer" :src="this.avatar" alt="Avatar"
					class="object-cover rounded-full w-36 h-36 opacity-70" />
				<Icon icon="fluent:image-edit-20-filled" height="40"
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-800 shadow-xl" />
				<input type="file" @change="this.updateAvatar" class="hidden" accept=".png, .jpeg, .jpg" />
			</label>
			<div class="flex gap-2 items-center justify-center">
				<p class=" font-semibold text-2xl tracking-wide dark:text-white">
					{{ this.username }}
				</p>
				<Icon @click="this.changeCard(1)" icon="ri:edit-fill" height="30" data-te-toggle="modal"
					data-te-target="#exampleModal" data-te-ripple-init data-te-ripple-color="light"
					class="dark:text-white" />
			</div>
			<div class="flex items-center">
				<button v-if="this.is2FA" @click="this.changeCard(3)"
					class="px-10 py-2  font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow">
					Disable 2FA
				</button>
				<button v-else @click="this.changeCard(2)"
					class="px-10 py-2  font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow">
					Enable 2FA
				</button>
			</div>

			<div class="flex items-center justify-center gap-3">
				<button v-if="this.isDark"
					class="px-5 py-2  font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow ring">
					Dark
				</button>
				<button v-else @click="toggleDark()"
					class="px-5 py-2  font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow">
					Dark
				</button>
				<button v-if="!this.isDark"
					class="px-5 py-2  font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow ring">
					Light
				</button>
				<button v-else @click="toggleDark()"
					class="px-5 py-2  font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow">
					Light
				</button>
			</div>
		</div>

		<!-- Update Name Card -->
		<form v-else-if="this.currentCard == 1"
			class="flex flex-col gap-5 items-center justify-center w-4/5 md:w-[500px] rounded-2xl custom-box-shadow dark:bg-slate-900">
			<div class="flex w-full justify-start items-center pl-10 pt-7  font-bold text-2xl dark:text-white">
				Change your Name:
			</div>
			<div class="w-full px-10 py-2">
				<input type="text"
					class=" font-bold bg-gray-200 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
					v-model="this.newName" placeholder="Your new Name" @input="handleInput" required />
			</div>
			<p v-if="this.error" class="text-red-500 pb-5">
				{{ this.error }}
			</p>
			<p v-else-if="this.newName.length < 3" class="text-red-500 pb-2">
				Zid chi chwiyich 3afak :)
			</p>
			<p v-if="this.newName.length > 12" class="text-red-500 pb-2">
				3aya9tiiiii !!
			</p>
			<div class="flex w-full justify-end items-center  font-bold pr-10 pb-5 gap-5">
				<button type="button" @click="this.updateName"
					class="text-gray-100 dark:text-white shadow py-2 px-5 bg-blue-500 rounded-lg">
					Save
				</button>
				<button type="button" @click="this.changeCard(0)"
					class="dark:text-white shadow py-2 px-5 bg-gray-400 dark:bg-slate-700 rounded-lg">
					Cancel
				</button>
			</div>
		</form>

		<!-- Enabling 2fa Card -->
		<div v-else-if="this.currentCard == 2"
			class="flex flex-col gap-5 p-10 items-center justify-center w-4/5 md:w-[500px] rounded-2xl custom-box-shadow dark:bg-slate-900">
			<img src="http://10.32.120.112:3000/api/2fa/generate" alt="" class="w-64 h-64" />
			<p class="flex w-full justify-start items-center py-5 px-10 font-Poppins font-light text-xl text-gray-500">
				Install Google Authenticator app, and scan the above qrcode and enter the given
				number to turn on 2FA.
			</p>
			<div class="flex flex-col justify-center items-center text-center">
				<input v-model="this.otpCode"
					class="bg-gray-200 shadow m-2 border h-10 w-full text-center rounded placeholder-gray-500" type="text"
					inputmode="numeric" maxlength="6" placeholder="******" @input="handleInput" />
				<p v-if="this.error" class="text-red-500 pb-5">
					{{ this.error }}
				</p>
				<p v-else class="text-red-500 pb-5">
					{{ this.otpCode.length < 6 ? "Code must be 6 digits" : "" }} </p>
						<div class="flex w-full justify-end items-center  font-bold pr-10 pb-5 gap-5">
							<button @click="this.enable2FA()" :disabled="this.otpCode.length < 6"
								class="text-gray-100 dark:text-white shadow w-fit py-2 px-5 bg-blue-500 rounded-lg">
								Enable 2FA
							</button>
							<button type="button" @click="this.changeCard(0)"
								class="dark:text-white shadow py-2 px-5 bg-gray-400 dark:bg-slate-700 rounded-lg">
								Cancel
							</button>
						</div>
			</div>
		</div>

		<!-- Disable 2fa Card -->
		<div v-else-if="this.currentCard == 3"
			class="flex flex-col gap-5 p-10 items-center justify-center w-4/5 md:w-[500px] rounded-2xl custom-box-shadow dark:bg-slate-900">
			<h2 class="flex w-full justify-start items-center py-5 px-10  font-light text-xl text-gray-500">
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
						<div class="flex w-full justify-end items-center  font-bold pr-10 pb-5 gap-5">
							<button @click="this.disable2FA()" :disabled="this.otpCode.length < 6"
								class="text-gray-100 dark:text-white shadow w-fit py-2 px-5 bg-blue-500 rounded-lg">
								Disable 2FA
							</button>
							<button type="button" @click="this.changeCard(0)"
								class="dark:text-white shadow py-2 px-5 bg-gray-400 dark:bg-slate-700 rounded-lg">
								Cancel
							</button>
						</div>
			</div>
		</div>
	</div>
</template>
