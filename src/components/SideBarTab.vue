<!-- SidebarTab.vue -->
<template>
	<div class="relative max-w-xs overflow-hidden bg-cover bg-no-repeat p-3 m-3 rounded-md cursor-pointer">
		<div v-if="isActive" class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden
			 bg-blue-500 bg-fixed opacity-50 transition duration-300 ease-in-out">
		</div>
		<div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden
			 bg-blue-300 bg-fixed opacity-0 transition duration-300
			  ease-in-out hover:opacity-30">
		</div>
		<Icon class="text-gray-600" :icon="iconName" height="28" />
	</div>
</template>
  
<script>
import { Icon } from '@iconify/vue';

export default {
	props: {
		iconName: String,
		name: String,
	},
	components: {
		Icon,
	},
	// setup(props) {
	// 	console.log("iconName is: " + props.iconName);
	// 	console.log("name is: " + props.name);
	// },
	computed: {
		isActive() {
			return this.$route.name === this.name;
		},
	},
};
</script>