<!-- NotFound.vue -->
<template>
  <div class="flex items-center justify-center h-screen dark:bg-slate-800 p-10">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">Opps!!</h1>
      <p class="text-lg text-gray-600 mt-4 mx-20 lg:mx-40 dark:text-gray-400">
        Something went wrong. feel free to contact us if the problem presists.
      </p>
      <div class="flex gap-5 items-center justify-center w-full">
        <router-link to="/" class="mt-8 text-blue-500 hover:underline text-lg">Go to Home</router-link>
        <p class="mt-8 text-blue-500 hover:underline text-lg"> - </p>
        <button @click="$router.go(-1) " class="mt-8 text-blue-500 hover:underline text-lg">Go Back</button>
      </div>
    </div>
  </div>
</template>
