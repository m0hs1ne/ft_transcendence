import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChatView from "../views/ChatView.vue";
import ProfileView from "../views/ProfileView.vue";
import SearchView from "../views/SearchView.vue";
import leaderboardView from "../views/LeaderboardView.vue";
import SettingView from "../views/SettingView.vue";
import SignInView from "../views/SignInView.vue";
import GameView from "../views/GameView.vue";
import UserProfileView from "../views/UserProfileView.vue";
import NotFound from "../views/NotFound.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatView,
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/users/:id",
      name: "user",
      component: UserProfileView,
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: leaderboardView,
    },
    {
      path: "/search",
      name: "search",
      component: SearchView,
    },
    {
      path: "/setting",
      name: "setting",
      component: SettingView,
    },
    {
      path: "/signIn",
      name: "signIn",
      component: SignInView,
    },
    {
      path: "/play",
      name: "game",
      component: GameView,
    },
    {
      path: "/:catchAll(.*)",
      name: "404",
      component: NotFound,
    },
  ],
});

export default router;
