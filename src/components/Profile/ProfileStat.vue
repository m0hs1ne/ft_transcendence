<template>
	<div class="flex flex-col items-center justify-center m-5 gap-1">
		<h1 class=" font-bold text-3xl tracking-wide dark:text-white">
			{{ title }}
		</h1>
		<h2 class=" font-light text-gray-500 dark:text-gray-300">
			{{ description }}
		</h2>
	</div>
</template>

<script setup>
const props = defineProps(['title', 'description']);
</script>