<script>
import { SharedData } from './../stores/state.ts';
import { useDark, useToggle } from '@vueuse/core';

export default {
	data() {
		return {
			username: String,
			avatar: String,
			wins: String,
			battles: String,
			winrat: String,
		}
	},
	setup(props) {
		const isDark = useDark();
		const toggleDark = useToggle(isDark);
		const state = SharedData();
		console.log("isDark: ", isDark)
		return { state, isDark, toggleDark };
	},
	methods:
	{
		setData() {
			this.username = this.state.userData.username;
			this.avatar = this.state.userData.avatar;
			this.wins = this.state.userData.wins;
			this.battles = this.state.userData.wins + this.state.userData.losses;
			this.winrat = "100%";
		}
	},
	mounted() {
		this.setData();
	}
}
</script>

<template>
	<div class="m-auto flex items-center justify-center h-screen ml-20 dark:bg-slate-800">
		<div
			class="flex flex-col gap-5 items-center justify-center w-4/5 md:w-[500px] py-20 rounded-2xl custom-box-shadow dark:bg-slate-900">
			<div class="w-36 h-36 bg-gray-300 rounded-full shadow">
				<img :src="this.avatar" alt="Avatar" class=" object-cover rounded-full w-full">
			</div>
			<p class="font-Poppins font-semibold text-2xl tracking-wide mx-5 dark:text-white">
				{{ this.username }}
			</p>
			<div class="flex items-center">
				<input class="mr-2 leading-normal" type="checkbox">
				<span class="font-Poppins font-semibold tracking-wide text-xl dark:text-white">
					Enable 2FA
				</span>
			</div>

			<div class="flex items-center justify-center gap-3">
				<div v-if="this.isDark"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow ring">
					Dark
				</div>
				<div v-else
					@click="toggleDark()"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow">
					Dark
				</div>
				<div v-if="!this.isDark"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow ring">
					Light
				</div>
				<div v-else
					@click="toggleDark()"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-800 rounded-md shadow">
					Light
				</div>
			</div>
		</div>

	</div>
</template>
