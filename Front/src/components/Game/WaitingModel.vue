<template>
    <div
        class="flex flex-col gap-5 p-7 items-center justify-center w-4/5 md:w-[400px] rounded-2xl custom-box-shadow dark:bg-slate-900">
        <div class="flex w-full justify-center items-center  font-bold text-2xl dark:text-white">
            Waiting for opponent!
        </div>
        <div class="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
        <button @click="$router.go(-1)"
            class="text-gray-100 dark:text-white shadow w-fit mt-5 py-3 px-5 bg-gray-500 rounded-md  font-bold">
            Cancel
        </button>
    </div>
</template>
