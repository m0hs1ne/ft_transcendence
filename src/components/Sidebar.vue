<!-- Sidebar.vue -->
<template>
	<aside class="h-screen w-20 shadow-2xl text-black flex flex-col items-center">
		<!-- Logo -->
		<div class="pt-6">
			<img src="../assets/imgs/Logo.png" alt="Logo" class="w-8 h-8">
		</div>

		<!-- Tabs -->
		<div class="flex flex-col items-center mt-8 bg-no-repeat">
			<router-link to="/">
				<SidebarTab iconName="teenyicons:home-solid" name="home" />
			</router-link>
			<router-link to="/chat">
				<SidebarTab iconName="teenyicons:chat-typing-solid" name="chat" />
			</router-link>
			<router-link to="/profile">
				<SidebarTab iconName="teenyicons:user-solid" name="profile" />
			</router-link>
			<router-link to="/search">
				<SidebarTab iconName="teenyicons:search-circle-solid" name="search" />
			</router-link>
			<router-link to="/setting">
				<SidebarTab iconName="teenyicons:cog-solid" name="setting" />
			</router-link>
		</div>

		<!-- Bottom Icons -->
		<div class="mt-auto p-4">
			<div class="flex items-center p-3 m-3 cursor-pointer">
				<Icon class=" text-gray-600" icon="teenyicons:sun-solid" height="28" />
			</div>
			<div @click="confirmLogout" class="flex items-center p-3 m-3 cursor-pointer">
				<Icon class=" text-gray-600" icon="ion:log-out" height="28" />
			</div>
		</div>
	</aside>
</template>
  
<script>
import { Icon } from '@iconify/vue';
import SidebarTab from './SidebarTab.vue';

export default {
	components: {
		SidebarTab,
		Icon,
	},
	methods: {
		confirmLogout() {
			const confirmed = window.confirm('Are you sure you want to log out?');

			if (confirmed) {
				this.$router.push('/SignIn');
			} else {
			}
		},
	},
};
</script>
  