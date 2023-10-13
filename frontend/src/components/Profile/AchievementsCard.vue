<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

const achfs = ref([
	{ icon: "ph:rocket-fill", title: "Unstoppable", desc: "Play 10 games", state: 1 },
	{ icon: "ph:baby-fill", title: "Newbie", desc: "Win 3 games", state: 1 },
	{ icon: "ph:medal-fill", title: "Winner", desc: "Win 10 games", state: 1 },
	{ icon: "ph:hand-fill", title: "Master", desc: "Win 100 games", state: 0 },
	{ icon: "ph:fire-fill", title: "Grand Master", desc: "Win 1000 games", state: 0 },
	{ icon: "solar:danger-bold", title: "Loser", desc: "Lose 10 games", state: 0 },
	{ icon: "ion:game-controller", title: "Challenger", desc: "Challenge a friend", state: 0 },
	{ icon: "ph:users-three-fill", title: "Squad", desc: "Add 3 friends", state: 0 },
	{ icon: "uil:create-dashboard", title: "Creator", desc: "Create a channel", state: 0 },
	{ icon: "icon-park-solid:protect", title: "Safety first", desc: "Enable 2FA", state: 0 },
]);

</script>

<template>
	<div class="lg:col-span-2 flex flex-col">
		<h1 class="p-7 font-Poppins font-semibold text-4xl dark:text-white">
			Achievements:
		</h1>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
			<div v-for="(val, index) in achfs" :key="index"
				class="flex flex-col w-full items-center justify-center rounded-2xl mx-auto py-5 gap-2
					custom-box-shadow dark:bg-slate-900 dark:text-white">
				<Icon class="text-gray-500 dark:text-gray-400" :icon="val.icon" height="80" />
				<h1 class="font-Poppins font-bold">{{ val.title }}</h1>
				<p class="font-Poppins text-gray-400">{{ val.desc }}</p>
				<div v-if="val.state"
					class="p-2 text-emerald-400 bg-green-700 bg-opacity-30 font-Poppins font-semibold rounded-md">
					Achieved
				</div>
				<div v-else 
					class="p-2 text-red-400 bg-red-300 bg-opacity-30 font-Poppins font-semibold rounded-md">
					In progress
				</div>
			</div>
		</div>
	</div>
</template>
  