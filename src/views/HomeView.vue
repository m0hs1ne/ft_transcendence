<script setup>
import PlayModeCard from '../components/PlayModeCard.vue';
</script>


<template>
	<div id="Main" class="grid lg:grid-cols-2 gap-10 py-10 px-10 ml-20 min-h-screen dark:bg-slate-800">
		<PlayModeCard src="./src/assets/imgs/mode1.png"
					  title="Classic"
					  description="First to score 20 wins" />

		<PlayModeCard src="./src/assets/imgs/mode2.png"
					  title="Rapid"
					  description="First to score 14 wins" />

		<PlayModeCard src="./src/assets/imgs/mode3.png"
					  title="Blitz"
					  description="First to score 3 wins" />

		<PlayModeCard src="./src/assets/imgs/mode4.png"
					  title="Bullet"
					  description="First to score wins" />
	</div>
</template>
  