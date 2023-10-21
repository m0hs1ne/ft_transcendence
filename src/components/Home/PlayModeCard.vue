<script>
import { GameData } from "./../../stores/state.ts";

export default
{
	props:{
		limit: String,
		src: String,
		title: String,
		description: String,
	},
	setup(props)
	{
		const gameData = GameData();
		return { gameData };
	},
	methods: {
	}
}
</script>

<template>
	<router-link @click="this.gameData.setMode(this.limit, this.title)" to="/play" class="relative rounded-2xl shadow-xl cursor-pointer">
			<img referrerpolicy="no-referrer" 
				:src="src"
				class="w-full h-full rounded-2xl shadow-xl object-cover">
			<div class="absolute bottom-10 left-10 font-Poppins text-white">
	
				<p class="font-bold text-3xl tracking-wider pb-3"
					style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
					{{ title }}
				</p>
				<p class="font-medium text-xl tracking-wide"
					style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">
					{{ description }}
				</p>
			</div>
	</router-link>
</template>
  