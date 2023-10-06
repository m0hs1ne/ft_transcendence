<script>
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar.vue';
import axios from 'axios';

export default {
  mounted() {
    this.checkValidUser()
  },
  components: {
    Sidebar,
  },
  methods: {
    isSidebarVisible() {
      const allowedPaths = ['/', '/chat', '/profile', '/search', '/setting'];
      return allowedPaths.includes(this.$route.path);
    },
    async checkValidUser() {
      await axios.get('http://localhost:3000/api/auth/success', { withCredentials: true })
        .then(() => {
          console.log('Logged IN')
        })
        .catch((error) => {
          console.log(error)
          this.$router.push('/signIn')
        })
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
