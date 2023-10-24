<script>
import { useDark, useToggle } from '@vueuse/core';
import { Icon } from '@iconify/vue';


export default {
	setup(props) {
		const isDark = useDark();
		const toggleDark = useToggle(isDark);
		return { isDark, toggleDark };
	},
	components:
	{
		Icon,
	},
}
</script>


<template>
	<div class="m-auto flex items-center justify-center h-screen w-screen px-5 dark:bg-slate-800">
		<div>
			<p class="font-Poppins font-bold text-3xl tracking-wide pb-5 pr-[5.5rem] dark:text-white">Welcome Back 👋</p>
			<p class="font-Poppins text-gray-700 dark:text-gray-300 text-lg">Let’s play ping pong...</p>
			<a href="http://10.32.120.112:3000/api/auth/google/login" class="container flex items-center justify-center 
						py-3 mt-10 mb-5 bg-blue-50 dark:bg-slate-900 rounded-lg">
				<img referrerpolicy="no-referrer" class="pr-5" src="./../assets/icons/Google.svg" alt="">
				<p class="font-Poppins text-gray-800 dark:text-gray-400">Sign in with Google</p>
			</a>
			<a href="http://10.32.120.112:3000/api/auth/42/login" class="container flex items-center justify-center 
						py-3 mb-10 bg-blue-50 dark:bg-slate-900 rounded-lg">
				<img referrerpolicy="no-referrer" class="pr-5" src="./../assets/icons/42.png" alt="">
				<p class="font-Poppins text-gray-800 dark:text-gray-400">Sign in with Intra</p>
			</a>
			<div class="flex items-center justify-center gap-3">
				<button v-if="this.isDark"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-900 rounded-md shadow ring">
					Dark
				</button>
				<button v-else @click="toggleDark()"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-900 rounded-md shadow">
					Dark
				</button>
				<button v-if="!this.isDark"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-900 rounded-md shadow ring">
					Light
				</button>
				<button v-else @click="toggleDark()"
					class="px-5 py-2 font-Poppins font-bold dark:text-white bg-gray-300 dark:bg-slate-900 rounded-md shadow">
					Light
				</button>
			</div>
		</div>
	</div>
</template>
  