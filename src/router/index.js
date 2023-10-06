import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue";
import ChatView from "../views/ChatView.vue";
import ProfileView from "../views/ProfileView.vue";
import SearchView from "../views/SearchView.vue";
import SettingView from "../views/SettingView.vue";
import SignInView from "../views/SignInView.vue";
import SignUpView from "../views/SignUpView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/setting',
      name: 'setting',
      component: SettingView
    },
    {
      path: '/signIn',
      name: 'signIn',
      component: SignInView
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUpView
    },
  ]
})

export default router
