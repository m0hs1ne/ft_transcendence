<template>
    <div v-if="this.userStore.error" class="fixed bottom-4 right-4 bg-red-800 text-white px-4 py-2 rounded-lg shadow-lg">
     {{ this.userStore.error }}
    </div>
  </template>
  
  <script>

  import { useUserStore } from './../../stores/state.ts';
  export default {

    setup() {
		const userStore = useUserStore();
		return { userStore };
	},

    data() {
      return {
        show: false,
        message: '',
      };
    },

    methods: {
      showToast() {
        setTimeout(() => {
          this.hideToast();
        }, 2000);
      },
      hideToast() {
        this.userStore.error = '';
      },
    },
    mounted()
    {
        this.showToast()
    }
  };
  </script>