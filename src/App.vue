<script>
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';


export default {
  components: {
    Sidebar,
  },
  methods: {
    isSidebarVisible() {
      const allowedPaths = ['/', '/chat', '/profile', '/search', '/setting'];
      return allowedPaths.includes(this.$route.path);
    }
  }
}
</script>

<template>
  <main>
    <Sidebar v-if="isSidebarVisible()" />
    <RouterView />
  </main>
</template>
