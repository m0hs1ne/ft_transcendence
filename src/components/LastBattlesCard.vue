<script setup>
import { ref } from 'vue';

const lastBattles = ref([
	{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 4 } },
	{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
	{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
	{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
	{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
	{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
	{ player1: { name: 'David goggins', score: 14 }, player2: { name: 'Jay Lawson', score: 0 } },
	// Add more elements as needed
]);

</script>

<template>
	<div id="Main" class="h-[480px] flex flex-col items-center rounded-2xl custom-box-shadow dark:bg-slate-900">
		<div class="flex flex-col items-center w-full rounded-t-2xl gap-3 pt-3">
			<h1 class="font-Poppins font-semibold text-2xl dark:text-white">
				Last Battles
			</h1>
			<div class="w-full h-px bg-gray-800 dark:bg-neutral-300"></div>
		</div>
		<div class="overflow-y-auto w-full">
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
</template>