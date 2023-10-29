<script>
import { Icon } from '@iconify/vue';
import SidebarTab from './SideBarTab.vue';
import axios from 'axios';
import { SharedData } from './../../stores/state.ts';
import { useDark, useToggle } from '@vueuse/core';


export default {
	setup(props) {
		const isDark = useDark();
		const toggleDark = useToggle(isDark);
		const state = SharedData();
		return { state, isDark, toggleDark };
	},
	methods: {
		async confirmLogout() {
			this.isError = false;

			const tmp = this.isDark;
			const confirmed = window.confirm('Are you sure you want to log out?');
			if (confirmed) {
				try {
					await axios.get('http://localhost:3000/api/auth/logout', { withCredentials: true });
					this.$socket.disconnect();
					this.$router.push('/signIn');

				}
				catch (error) {
					console.log("logdout error: ", error);
					this.isError = true;
				}
			}
		}
	},
	components: {
		Icon,
		SidebarTab,
	}
}

</script>
			
<!-- Sidebar.vue -->
<template>
	<aside class="fixed min-h-screen w-20 lg:w-24 shadow-2xl text-black flex flex-col items-center
				 dark:bg-slate-900">
		<!-- Logo -->
		<div class="pt-6 pb-4">
			<img referrerpolicy="no-referrer" src="../../assets/imgs/Logo.png" alt="Logo"
				class="w-[5rem] md:w-[10rem] lg:w-[15rem]">
		</div>

		<!-- Tabs -->
		<div class="flex flex-col items-center bg-no-repeat">
			<router-link to="/" title="Home">
				<SidebarTab iconName="teenyicons:home-solid" name="home" />
			</router-link>
			<router-link to="/chat" title="Chat">
				<SidebarTab iconName="teenyicons:chat-typing-solid" name="chat" />
			</router-link>
			<router-link to="/leaderboard" title="Leaderboard">
				<SidebarTab iconName="material-symbols:leaderboard" name="leaderboard" />
			</router-link>
			<router-link to="/search" title="Search">
				<SidebarTab iconName="teenyicons:search-circle-solid" name="search" />
			</router-link>
			<router-link to="/setting" title="Setting">
				<SidebarTab iconName="teenyicons:cog-solid" name="setting" />
			</router-link>
		</div>

		<!-- Bottom Icons -->
		<div class="mt-auto p-4">
			<router-link to="/profile" title="Profile" class="flex items-center p-3 m-3 cursor-pointer">
				<div class="w-[28px] h-[28px] bg-gray-300 rounded-full shadow">
					<img referrerpolicy="no-referrer" v-if="this.$route.path == '/profile'"
						:src="this.state.userData.avatar" alt="Avatar"
						class="aspect-square object-cover rounded-full w-[28px] h-[28px] ring ring-cyan-500">
					<img referrerpolicy="no-referrer" v-else :src="this.state.userData.avatar" alt="Avatar"
						class="aspect-square object-cover w-[28px] h-[28px] rounded-full">
				</div>
			</router-link>
			<div title="LogOut" @click="confirmLogout" class="flex items-center p-3 m-3 cursor-pointer">
				<Icon class="text-gray-600 dark:text-gray-400" icon="ion:log-out" height="28" />
			</div>
		</div>
	</aside>
</template>
  
  