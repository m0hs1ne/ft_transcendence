<template>
    <div
        class="flex flex-col gap-5 p-10 items-center justify-center w-4/5 md:w-[400px] rounded-2xl custom-box-shadow dark:bg-slate-900">
        <div class="flex w-full justify-center items-center font-Poppins font-semibold text-2xl dark:text-white">
            <span> Congrats!!&nbsp; </span>
            <span class="text-green-600">
                You win.
            </span>
        </div>
        <div class="flex items-center justify-center w-full gap-5 font-Poppins font-bold text-xl">
            <button @click="playAgain"
                class="text-gray-100 dark:text-white shadow w-fit mt-5 py-3 px-5 bg-emerald-600 rounded-md font-Poppins font-bold">
                Play Again
            </button>
            <button @click="$router.replace('/')"
                class="text-gray-100 dark:text-white shadow w-fit mt-5 py-3 px-5 bg-gray-500 rounded-md font-Poppins font-bold">
                Go Home
            </button>
        </div>
    </div>
</template>


<script>
export default {
    methods: {
        async playAgain() {
            await this.$router.replace('/');
            this.$router.push('/play');
        },
    }
}
</script>