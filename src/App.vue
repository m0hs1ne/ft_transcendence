<script>
import { RouterView } from 'vue-router'
import Sidebar from './components/NavBar/Sidebar.vue';
import Loading1 from './components/Loading/Loading1.vue';
import Loading2 from './components/Loading/Loading2.vue';
import axios from 'axios';

export default {
  mounted() {
    this.checkValidUser()
  },
  components: {
    Sidebar,
    Loading1,
    Loading2,
  },
  methods: {
    isSidebarVisible() {
      const allowedPaths = ['/', '/chat', '/profile', '/search', '/setting'];
      return allowedPaths.includes(this.$route.path);
    },
    async checkValidUser() {
      await axios.get('http://localhost:3000/api/auth/success', { withCredentials: true })
        .then(() => {
          console.log("path is: ", this.$route.path);
          if (this.$route.path.toLowerCase() == '/signin' || this.$route.path.toLowerCase() == '/signup')
            this.$router.push('/');
        })
        .catch((error) => {
          if (this.$route.path.toLowerCase() != '/signin' && this.$route.path.toLowerCase() != '/signup')
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
