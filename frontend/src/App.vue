<script setup>
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/NavBar/Sidebar.vue';
import { useUserStore } from './stores/state.ts';
import Loading1 from './components/Loading/Loading1.vue';
import Loading2 from './components/Loading/Loading2.vue';
import GamePlay from './components/game/GamePlay.vue';
import axios from 'axios';

const route = useRoute()

const isLoading = false;

const isSidebarVisible = () => {
  console.log("router path: ", route.path)
  const allowedPaths = ['/', '/chat', '/profile', '/search', '/setting', '/leaderboard'];
  return allowedPaths.includes(route.path);
};

const checkValidUser = async () => {
  this.loading = true;
  await axios.get('http://localhost:3000/api/auth/success', { withCredentials: true })
    .then(() => {
      if (router.path.toLowerCase() == '/signin' || router.path.toLowerCase() == '/signup')
        router.push('/');
    })
    .catch((error) => {
      if (router.path.toLowerCase() != '/signin' && router.path.toLowerCase() != '/signup')
        router.push('/signIn')
    })
  this.loading = false;
};

</script>

<template>
  <main>
    <Loading1 v-if="isLoading" />
    <Sidebar v-if="isSidebarVisible() && !isLoading" />
    <RouterView v-if="!isLoading" />
  </main>
</template>
