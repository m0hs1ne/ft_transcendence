<script>

export default{
	methods:{
		
	}
}
</script>

<template>
	<div class="flex justify-center items-start h-screen ml-20
				dark:bg-slate-800 text-gray-700 dark:text-gray-300">

		<div class="w-full max-w-[600px] px-10 py-5">
			<input type="text" id="first_name"
				class="bg-gray-200 font-Poppins font-light focus:font-bold py-2 px-4 rounded-lg w-full"
				v-model="this.newName" placeholder="Search" required>
		</div>
	</div>
</template>