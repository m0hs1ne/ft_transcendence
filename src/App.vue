<script>
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';

export default {
  components: {
    Sidebar,
  },
  methods: {
    Sidebar() {
      if (this.$route.path === "/" || this.$route.path === "/chat"
        || this.$route.path === "/profile" || this.$route.path === "/search"
        || this.$route.path === "/setting") {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<template>
  <div class="flex">
    <Sidebar v-if="Sidebar()" />
    <RouterView />
  </div>
</template>
