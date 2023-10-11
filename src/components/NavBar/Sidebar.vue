<script setup>
import { useRouter } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';
import { Icon } from '@iconify/vue';
import SidebarTab from './SideBarTab.vue';

const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter()

const confirmLogout = () => {
  const confirmed = window.confirm('Are you sure you want to log out?');

  if (confirmed) {
    // Use $router from the setup context
    router.push('/signIn');
  }
  // else: User canceled the logout
};

</script>
			
<!-- Sidebar.vue -->
<template>
	<aside class="fixed h-screen w-20 shadow-2xl text-black flex flex-col items-center
				 dark:bg-slate-900">
		<!-- Logo -->
		<div class="pt-6 pb-4">
			<img src="../../assets/imgs/Logo.png" alt="Logo" class="w-[5rem]">
		</div>

		<!-- Tabs -->
		<div class="flex flex-col items-center bg-no-repeat">
			<router-link to="/" title="Home">
				<SidebarTab iconName="teenyicons:home-solid" name="home" />
			</router-link>
			<router-link to="/chat" title="Chat">
				<SidebarTab iconName="teenyicons:chat-typing-solid" name="chat" />
			</router-link>
			<router-link to="/profile" title="Profile">
				<SidebarTab iconName="teenyicons:user-solid" name="profile" />
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
			<div title="Theme" @click="toggleDark()"
				 class="flex items-center p-3 m-3 cursor-pointer">
				<Icon v-if="isDark" class="text-gray-600 dark:text-gray-400" icon="teenyicons:sun-solid" height="28" />
				<Icon v-else class="text-gray-600 dark:text-gray-400" icon="ic:round-dark-mode" height="28" />
			</div>
			<div title="LogOut" @click="confirmLogout"
				 class="flex items-center p-3 m-3 cursor-pointer">
				<Icon class="text-gray-600 dark:text-gray-400" icon="ion:log-out" height="28" />
			</div>
		</div>
	</aside>
</template>
  
  