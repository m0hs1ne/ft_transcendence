<!-- CanvasComponent.vue -->
<template>
  <div class="flex bg-slate-800 h-screen items-center justify-center">
    <WaitingModel v-if="this.gameData.phase === 'W'" />
    <Canvas v-if="this.gameData.phase === 'P'" />
  </div>
</template>

<script>
import { GameData } from "./../stores/state.ts";
import WaitingModel from "./../components/Game/WaitingModel.vue";
import Canvas from "./../components/Game/Canvas.vue";
import { ref } from "vue";

export default {
  setup() {
    const gameData = GameData();
    return { gameData };
  },
  components: {
    WaitingModel,
    Canvas,
  },
  updated() {
    console.log("updated")
    console.log("phase", this.gameData.phase)
  },
};
</script>
