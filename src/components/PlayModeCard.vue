<template>
	<div class="relative rounded-2xl shadow-xl cursor-pointer">
		<img 
			:src="src"
			class="w-full h-full rounded-2xl shadow-xl object-cover">
		<p class="absolute bottom-14 left-10 font-['Poppins'] font-bold
					text-3xl tracking-wider text-white"
			style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
			{{ title }}
		</p>
		<p class="absolute bottom-5 left-10 font-['Poppins'] font-medium
					text-xl tracking-wide text-white"
			style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">
			{{ description }}
		</p>
	</div>
</template>

<script setup>
const props = defineProps(['src', 'title', 'description']);
</script>
  