<script>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import ProfileStat from "./../components/Profile/ProfileStat.vue"
import { SharedData } from './../stores/state.ts';

export default {
	setup(props) {
		const state = SharedData();
		const username = ref("");
		const avatar = ref("");
		const wins = ref(1);
		const losses = ref(1);
		const battles = ref(1);
		const winrat = ref(1);
		const friends = ref([]);
		const is2FA = ref(false);

		username.value = state.userData.username;
		avatar.value = state.userData.avatar;
		wins.value = state.userData.wins - 1;
		losses.value = state.userData.losses - 1;
		battles.value = state.userData.wins + state.userData.losses - 2;
		winrat.value = parseInt(state.userData.wins / (state.userData.wins + state.userData.losses) * 100) + '%';
		friends.value = state.userData.friends;
		is2FA.value = state.userData.is2faEnabled;


		const lastBattles = [
			{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 4 } },
			{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
			{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
			{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
			{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
			{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
			{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
			// Add more elements as needed
		];

		const achievements = [
			{ icon: "ph:rocket-fill", title: "Unstoppable", desc: "Play 10 games", status: battles.value >= 10 },
			{ icon: "ph:baby-fill", title: "Newbie", desc: "Win 3 games", status: wins.value >= 3 },
			{ icon: "ph:medal-fill", title: "Winner", desc: "Win 10 games", status: wins.value >= 10 },
			{ icon: "ph:hand-fill", title: "Master", desc: "Win 100 games", status: wins.value >= 100 },
			{ icon: "ph:fire-fill", title: "Grand Master", desc: "Win 1000 games", status: wins.value >= 1000 },
			{ icon: "solar:danger-bold", title: "Loser", desc: "Lose 10 games", status: losses.value >= 10 },
			{ icon: "ph:users-three-fill", title: "Squad", desc: "Add 3 friends", status: friends.value.length >= 3 },
			{ icon: "icon-park-solid:protect", title: "Safety first", desc: "Enable 2FA", status: is2FA.value },
		];

		// Sort achievements based on the status property
		achievements.sort((a, b) => (b.status - a.status));

		return {
			username,
			avatar,
			wins,
			lastBattles,
			achievements,
			battles,
			winrat,
		};
	},
	components: {
		ProfileStat,
		Icon,
	},
};
</script>


<template>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-10 p-10 ml-20
				min-h-screen dark:bg-slate-800">
		<!-- <ProfileCard /> -->
		<div
			class="h-[400px] md:h-[450px] flex flex-col items-center justify-center rounded-2xl custom-box-shadow dark:bg-slate-900">
			<div class="w-44 h-44 bg-gray-300 rounded-full shadow">
				<img referrerpolicy="no-referrer" :src="this.avatar" alt="Avatar"
					class=" object-cover rounded-full w-44 h-44">
			</div>
			<p class="font-Poppins font-semibold text-3xl tracking-wide mx-5 mt-5 mb-7 dark:text-white">
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

		<!-- <LastBattlesCard /> -->
		<div class="h-[400px] md:h-[450px] flex flex-col items-center rounded-2xl custom-box-shadow dark:bg-slate-900">
			<div class="flex flex-col items-center w-full rounded-t-2xl gap-3 pt-3">
				<h1 class="font-Poppins font-semibold text-2xl dark:text-white">
					Last Battles
				</h1>
				<div class="w-full h-px bg-gray-800 dark:bg-neutral-300"></div>
			</div>
			<div class="overflow-y-auto w-full font-Poppins text-lg font-medium">
				<div v-for="(battle, index) in lastBattles" :key="index"
					class="m-4 p-4 rounded-lg custom-box-shadow dark:bg-slate-800 dark:text-white">
					<div class="mb-2">
						{{ battle.player1.name }} ({{ battle.player1.score }})
					</div>
					<div>
						{{ battle.player2.name }} ({{ battle.player2.score }})
					</div>
				</div>
			</div>
		</div>

		<!-- <AchievementsCard /> -->
		<div class="md:col-span-2 flex flex-col">
			<h1 class="p-7 font-Poppins font-semibold text-4xl dark:text-white">
				Achievements:
			</h1>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
				<div v-for="(val, index) in achievements" :key="index" class="flex flex-col w-full items-center justify-center rounded-2xl mx-auto py-5 gap-2
					custom-box-shadow dark:bg-slate-900 dark:text-white">
					<Icon class="text-gray-500 dark:text-gray-400" :icon="val.icon" height="80" />
					<h1 class="font-Poppins font-bold">{{ val.title }}</h1>
					<p class="font-Poppins text-gray-400">{{ val.desc }}</p>
					<div v-if="val.status"
						class="p-2 text-emerald-400 bg-green-700 bg-opacity-30 font-Poppins font-semibold rounded-md">
						Achieved
					</div>
					<div v-else class="p-2 text-red-400 bg-red-300 bg-opacity-30 font-Poppins font-semibold rounded-md">
						In progress
					</div>
				</div>
			</div>
		</div>
	</div>
</template>