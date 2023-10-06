<!-- SidebarTab.vue -->
<template>
	<div v-if="isActive" class="relative max-w-xs overflow-hidden bg-cover bg-no-repeat p-3 m-3 rounded-md cursor-pointer bg-blue-300 bg-opacity-50">
		<Icon class="text-sky-500" :icon="iconName" height="28" />
	</div>
	<div v-else class="relative max-w-xs overflow-hidden bg-cover bg-no-repeat p-3 m-3 rounded-md
					   cursor-pointer hover:bg-opacity-40 hover:bg-sky-500">
		<Icon class="text-gray-500 dark:text-gray-300" :icon="iconName" height="28" />
	</div>
</template>
  
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const props = defineProps(['iconName', 'name']);
const router = useRoute()

const isActive = computed(() => {
  return router.name === props.name;
});
</script>