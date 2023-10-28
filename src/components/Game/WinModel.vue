<template>
    <div
        class="flex flex-col gap-5 p-10 items-center justify-center w-4/5 md:w-[400px] rounded-2xl custom-box-shadow dark:bg-slate-900">
        <div class="flex w-full justify-center items-center  font-semibold text-2xl dark:text-white">
            <span> Congrats!!&nbsp; </span>
            <span class="text-green-600">
                You win.
            </span>
        </div>
        <div class="flex items-center justify-center w-full gap-5  font-bold text-xl">
            <button @click="playAgain"
                class="text-gray-100 dark:text-white shadow w-fit mt-5 py-3 px-5 bg-emerald-600 rounded-md  font-bold">
                Play Again
            </button>
            <button @click="$router.replace('/')"
                class="text-gray-100 dark:text-white shadow w-fit mt-5 py-3 px-5 bg-gray-500 rounded-md  font-bold">
                Go Home
            </button>
        </div>
    </div>
</template>


<script>
import { GameData } from "../../stores/state.ts";

export default {
    props:{
        limit: '1',
    },
    setup() {
    const gameData = GameData();
    return { gameData};
  },
    methods: {
        async playAgain() {
            this.gameData.random = true;
            this.gameData.modeLimit = this.limit;
            await this.$router.replace('/');
            this.$router.push('/play');
        },
    }
}
</script>