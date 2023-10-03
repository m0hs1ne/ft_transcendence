<template>
	<main class="m-auto flex items-center justify-center h-screen w-screen px-5 dark:bg-slate-800">
		<div id="LeftColumn">
			<p class="font-Poppins font-bold text-3xl tracking-wide pb-5 dark:text-white">Let’s get started 🔥</p>
			<p class="font-Poppins text-gray-700 dark:text-gray-300 text-lg">Challenge, win, lose, learn and improve...</p>
			<router-link to="/" class="container flex items-center justify-center 
						py-3 mt-10 mb-5 bg-blue-50 dark:bg-slate-900 rounded-lg">
				<img class="pr-5" src="./../assets/icons/Google.svg" alt="">
				<p class="font-Poppins text-gray-800 dark:text-gray-400">Sign up with Google</p>
			</router-link>
			<router-link to="/" class="container flex items-center justify-center 
						py-3 mb-10 bg-blue-50 dark:bg-slate-900 rounded-lg">
				<img class="pr-5" src="./../assets/icons/42.png" alt="">
				<p class="font-Poppins text-gray-800 dark:text-gray-400">Sign up with Intra</p>
			</router-link>
			<div class="text-center">
				<span class="font-Poppins text-gray-700 dark:text-gray-300">Already have an account? </span>
				<router-link to="/SignIn" class="font-Poppins text-blue-500 dark:text-cyan-500 font-medium">Sign In</router-link>
			</div>
		</div>
		<!-- <div class="bg-gray-400 rounded-2xl ml-10 mr-10 w-1/2">
			<img src="./../assets/imgs/AuthTable.png" class="rounded-2xl ">
		</div> -->
	</main>
</template>
  