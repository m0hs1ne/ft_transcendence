<script setup>
import { useRouter } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';
import { Icon } from '@iconify/vue';
import SidebarTab from './SidebarTab.vue';

const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter()

const confirmLogout = () => {
  const confirmed = window.confirm('Are you sure you want to log out?');

  if (confirmed) {
    // Use $router from the setup context
    router.push('/SignIn');
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
			<img src="../assets/imgs/logo.png" alt="Logo" class="w-[5rem]">
		</div>

		<!-- Tabs -->
		<div class="flex flex-col items-center bg-no-repeat">
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
			<div @click="toggleDark()"
				 class="flex items-center p-3 m-3 cursor-pointer">
				<Icon v-if="isDark" class="text-gray-600 dark:text-gray-400" icon="teenyicons:sun-solid" height="28" />
				<Icon v-else class="text-gray-600 dark:text-gray-400" icon="ic:round-dark-mode" height="28" />
			</div>
			<div @click="confirmLogout"
				 class="flex items-center p-3 m-3 cursor-pointer">
				<Icon class="text-gray-600 dark:text-gray-400" icon="ion:log-out" height="28" />
			</div>
		</div>
	</aside>
</template>
  
  