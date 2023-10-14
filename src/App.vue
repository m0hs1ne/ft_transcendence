<script>
import { onUpdated } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from './components/NavBar/Sidebar.vue';
import Loading from './components/Loading/Loading.vue';
import axios from 'axios';
import { SharedData } from './stores/state.ts';

export default {
  setup(props) {
    const state = SharedData();
    return { state };
  },
  methods: {
    isSidebarVisible() {
      const allowedPaths = ['/', '/chat', '/profile', '/search', '/setting', '/leaderboard'];
      return allowedPaths.includes(this.$route.path);
    },
    routerGard()
    {
      const path = this.$route.path.toLowerCase();
      if (this.state.isLoggedIn && (path == '/signin' || path == '/signup'))
        this.$router.push('/');
      else if (!this.state.isLoggedIn && path != '/signin' && path != '/signup')
        this.$router.push('/signIn');
    }
  },
  async created() {
    await this.state.fetchData();
    this.routerGard();
  },
  components: {
    Loading,
    Sidebar,
    RouterView,
  }
}
</script>

<template>
  <main>
    <Loading v-if="this.state.isLoading" />
    <Sidebar v-if="isSidebarVisible() && !this.state.isLoading" />
    <RouterView v-if="!this.state.isLoading" />
  </main>
</template>
