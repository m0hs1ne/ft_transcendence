<template>
	<div class="container m-auto flex items-center justify-center h-screen px-5">
		<div id="LeftColumn">
			<p class="font-['Poppins'] font-bold text-3xl tracking-wide pb-5 pr-[5.5rem]">Welcome Back  👋</p>
			<p class="font-['Poppins'] text-gray-700 text-lg">Let’s play ping pong...</p>
			<router-link to="/" class="container flex items-center justify-center 
						py-3 mt-10 mb-5 bg-blue-50 rounded-lg">
				<img class="pr-5" src="./../assets/icons/Google.svg" alt="">
				<p class="font-['Poppins'] text-gray-800">Sign in with Google</p>
			</router-link>
			<router-link to="/" class="container flex items-center justify-center 
						py-3 mb-10 bg-blue-50 rounded-lg">
				<img class="pr-5" src="./../assets/icons/42.png" alt="">
				<p class="font-['Poppins'] text-gray-800">Sign in with Intra</p>
			</router-link>
			<div class="text-center">
				<span class="font-['Poppins'] text-gray-700">Don't you have an account? </span>
				<router-link to="/SignUp" class="font-['Poppins'] text-blue-500 font-medium">Sign up</router-link>
			</div>
		</div>
		<!-- <div class="bg-gray-400 rounded-2xl mx-10">
			<img src="./../assets/imgs/AuthTable.png" class="h-auto rounded-2xl ">
		</div> -->
	</div>
</template>
  