<script>
import axios from 'axios';

export default {
	data() {
		return {
			query: '',
			results: {},
		}
	},
	methods: {
		async search(event) {
			console.log("new query: ", this.query)
			try {
				const response = await axios.post('http://localhost:3000/api/users/search', {
					query: this.query,
				}, {
					withCredentials: true,
				});
				console.log("Search response", response.data);
				this.results = response.data.users;
			} catch (error) {
				console.error('Error searching users:', error);
			}
		}
	}
}
</script>

<template>
	<div class="flex flex-col justify-start items-center min-h-screen ml-20 dark:bg-slate-800">

		<div class="w-full flex flex-col justify-center items-center px-10">
			<div class="w-full max-w-[400px] py-5">
				<input type="text" id="first_name"
					class="font-Poppins font-bold bg-gray-200 text-gray-900 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white"
					@input="this.search" v-model="this.query" placeholder="Search" required>
			</div>
			<div v-for="(player, index) in this.results" :key="index" class="flex items-center justify-start my-5 px-5 py-3 rounded-2xl 
			custom-box-shadow dark:bg-slate-700 dark:text-white">
				<router-link :to="'/users/' + player.id"  class="flex items-center justify-between min-w-full">
					<div class="flex items-center">
						<p class="font-Poppins font-semibold text-xl">
							{{ index + 1 }}.
						</p>
						<div class="w-14 h-14 md:w-20 md:h-20 bg-gray-300 rounded-full shadow ml-2 mr-4">
							<img referrerpolicy="no-referrer" :src="player.avatar" alt="Avatar"
								class="object-cover rounded-full w-14 h-14 md:w-20 md:h-20">
						</div>
						<p class="w-36 md:w-56 overflow-ellipsis line-clamp-1
						font-Poppins font-semibold md:text-xl tracking-wide dark:text-white">
							{{ player.username }}
						</p>
					</div>
					<p class="min-w-fit font-Poppins font-semibold text-xl md:text-2xl tracking-wide dark:text-white">
						{{ (player.wins / (player.wins + player.losses)) * 100 }}%
					</p>
				</router-link>
			</div>
		</div>
	</div>
</template>