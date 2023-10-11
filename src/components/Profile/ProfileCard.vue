<script setup>
import ProfileStat from "./ProfileStat.vue"
import { useUserStore } from './../../stores/state.ts';
</script>

<template>
	<div class="relative h-[380px] md:h-[480px] flex flex-col items-center rounded-2xl custom-box-shadow dark:bg-slate-900">
		<div 
			class="absolute w-full h-[100px] md:h-[120px] bg-blue-200 rounded-t-2xl top-0 left-0 right-0">
		</div>
		<div class="absolute flex flex-col gap-5 items-center rounded-2xl top-[50px] md:top-[60px]">
			<div class="w-36 h-36 bg-gray-300 rounded-full shadow">
			</div>
			<p class="font-Poppins font-semibold text-2xl tracking-wide mx-5 dark:text-white">
				David goggins
			</p>
			<p class="font-Poppins font-light text-lg tracking-wide mx-7 text-center 
					text-gray-500 dark:text-gray-400">
				They don't know me son! You don't know me son!
			</p>
			<div class="flex items-center">
				<ProfileStat title="75" description="Battles" />
				<div class="w-0.5 h-[60px] mx-3 rotate-180 bg-neutral-600 dark:bg-neutral-200"></div>
				<ProfileStat title="75" description="Wins" />
				<div class="w-0.5 h-[60px] mx-3 rotate-180 bg-neutral-600 dark:bg-neutral-200"></div>
				<ProfileStat title="100%" description="Win-rat" />
			</div>
		</div>
	</div>
</template>