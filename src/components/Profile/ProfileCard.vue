<script>
import ProfileStat from "./ProfileStat.vue"
import { SharedData } from './../../stores/state.ts';

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
		const state = SharedData();
		return { state };
	},
	methods:
	{
	},
	components:
	{
		ProfileStat,
	},
	mounted() {
		this.username = this.state.userData.username;
		this.avatar = this.state.userData.avatar;
		this.wins = this.state.userData.wins;
		this.battles = this.state.userData.wins + this.state.userData.losses;
		this.winrat = "100%";
	}
}
</script>

<template>
	<div class="relative h-[380px] md:h-[480px] flex flex-col items-center rounded-2xl custom-box-shadow dark:bg-slate-900">
		<div class="absolute w-full h-[120px] md:h-[150px] bg-blue-200 rounded-t-2xl top-0 left-0 right-0">
		</div>
		<div class="absolute flex flex-col gap-5 items-center rounded-2xl top-[65px] md:top-[75px]">
			<div class="w-36 h-36 bg-gray-300 rounded-full shadow">
				<img :src="this.avatar" alt="Avatar" class=" object-cover rounded-full w-full">
			</div>
			<p class="font-Poppins font-semibold text-2xl tracking-wide mx-5 dark:text-white">
				{{ this.username }}
			</p>
			<div class="flex items-center">
				<ProfileStat :title="this.battles" description="Battles" />
				<div class="w-0.5 h-[60px] mx-3 rotate-180 bg-neutral-600 dark:bg-neutral-200"></div>
				<ProfileStat :title="this.wins" description="Wins" />
				<div class="w-0.5 h-[60px] mx-3 rotate-180 bg-neutral-600 dark:bg-neutral-200"></div>
				<ProfileStat :title="this.winrat" description="Win-rat" />
			</div>
		</div>
	</div>
</template>