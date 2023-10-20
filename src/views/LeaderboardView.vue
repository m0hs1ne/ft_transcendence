<script>
import axios from 'axios';

export default {
	data() {
		return {
			leaderboard: {},
		}
	},
	methods: {
		async getLeaderBoard() {
			try {
				const response = await axios.get("http://localhost:3000/api/users/leaderboard", {
					withCredentials: true,
				});
				this.leaderboard = response.data;
				console.log("leaderboard: ", this.leaderboard);

			} catch (error) {
				console.error('getLeaderBoard:', error);
			}
		},
	},
	async created() {
		await this.getLeaderBoard();
	},
}
</script>

<template>
	<div class="flex flex-col justify-start items-center min-h-screen ml-20 dark:bg-slate-800">
		<div class="px-10">
			<h1 class="mt-10 font-Poppins font-semibold text-4xl dark:text-white">
				Leaderboard:
			</h1>
			<div v-for="(player, index) in this.leaderboard" :key="index" class="flex items-center justify-start my-5 px-5 py-3 rounded-2xl 
				custom-box-shadow dark:bg-slate-700 dark:text-white">
				<div class="flex items-center justify-between min-w-full">
					<div class="flex items-center">
						<p class="font-Poppins font-semibold text-xl">
							{{ index + 1 }}.
						</p>
						<div class="w-14 h-14 md:w-20 md:h-20 bg-gray-300 rounded-full shadow ml-2 mr-4">
							<img referrerpolicy="no-referrer" :src="player.avatar" alt="Avatar" class="object-cover rounded-full w-14 h-14 md:w-20 md:h-20">
						</div>
						<p class="w-36 md:w-56 overflow-ellipsis line-clamp-1
							font-Poppins font-semibold md:text-xl tracking-wide dark:text-white">
							{{ player.username }}
						</p>
					</div>
					<p class="min-w-fit font-Poppins font-semibold text-xl md:text-2xl tracking-wide dark:text-white">
						{{ (player.wins / (player.wins + player.losses)) * 100 }}%
					</p>
				</div>
			</div>
		</div>
	</div>
</template>