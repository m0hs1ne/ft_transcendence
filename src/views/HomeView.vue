<script>
import PlayModeCard from '../components/Home/PlayModeCard.vue';
import { SharedData } from '../stores/state.ts';

export default {
	setup(props) {
		const state = SharedData();
		return { state };
	},
	data() {
		return {
			screenWidth: 0,
		};
	},
	components: {
		PlayModeCard,
	},
	computed: {
		// Computed property to track the screen width
		updateScreenWidth() {
			return () => {
				this.screenWidth = window.innerWidth;
			};
		},
	},
	mounted() {
		// Attach an event listener to the window resize event
		window.addEventListener("resize", this.updateScreenWidth);

		// Ensure that the screen width is updated initially
		this.updateScreenWidth();
	},
	beforeUnmount() {
		// Remove the event listener when the component is unmounted
		console.log("this.updateScreenWidth ====> ", this.updateScreenWidth)
		window.removeEventListener("resize", this.updateScreenWidth);
	},
}
</script>

<template>
	<div class="grid md:grid-cols-2 gap-10 py-10 px-10 ml-20 lg:ml-24 min-h-screen dark:bg-slate-800">
		<PlayModeCard src="./src/assets/imgs/mode1.png" title="Classic" description="First to score 20 wins" limit=20 />

		<PlayModeCard src="./src/assets/imgs/mode2.png" title="Rapid" description="First to score 14 wins" limit=14 />

		<PlayModeCard src="./src/assets/imgs/mode3.png" title="Blitz" description="First to score 3 wins" limit=3 />

		<PlayModeCard src="./src/assets/imgs/mode4.png" title="Bullet" description="First to score wins" limit=1 />
	</div>
</template>
  