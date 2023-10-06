<template>
	<div class="relative rounded-2xl shadow-xl cursor-pointer">
		<img 
			:src="src"
			class="w-full h-full rounded-2xl shadow-xl object-cover">
		<div class="absolute bottom-10 left-10 font-Poppins text-white">

			<p class="font-bold text-3xl tracking-wider pb-3"
				style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
				{{ title }}
			</p>
			<p class="font-medium text-xl tracking-wide"
				style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">
				{{ description }}
			</p>
		</div>
	</div>
</template>

<script setup>
const props = defineProps(['src', 'title', 'description']);
</script>
  