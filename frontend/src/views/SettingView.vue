<script setup>
</script>

<template>
	<main class="m-auto flex items-center justify-center h-screen w-screen dark:bg-slate-800">
		<form class="max-w-lg text-gray-700 dark:text-gray-300 px-5 ml-20">

			<!-- Profile Picture -->
			<div class="flex flex-col justify-center w-full my-6">
				<label class="block uppercase tracking-wide font-bold mb-2" for="grid-first-name">
					Profile Picture
				</label>
				<label for="dropzone-file"
					class="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
					<div class="flex flex-col items-center justify-center pt-5 pb-6">
						<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to
								upload</span> or drag and drop</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
					</div>
					<input type="file" class="hidden" />
				</label>
			</div>


			<!-- Name -->
			<div class="flex flex-wrap -mx-3 mb-6">
				<div class="w-full px-3">
					<label class="block uppercase tracking-wide font-bold mb-2" for="grid-password">
						Name
					</label>
					<input
						class="appearance-none focus:text-gray-800 w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						type="text" placeholder="David goggins">
				</div>
			</div>

			<!-- Title -->
			<div class="flex flex-wrap -mx-3 mb-6">
				<div class="w-full px-3">
					<label class="block uppercase tracking-wide font-bold mb-2" for="grid-password">
						Title
					</label>
					<input
						class="appearance-none  focus:text-gray-800 w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
						type="text" placeholder="They don't know me son! You don't know me son!">
					<p class="text-gray-600 dark:text-gray-300 italic">This is title will be displayed under your Name, Be
						Creative!!</p>
				</div>
			</div>

			<!-- Enable 2FA -->
			<div class="flex items-center mb-6">
				<input class="mr-2 leading-normal" type="checkbox">
				<span class="font-Poppins font-semibold tracking-wide text-xl">
					Enable 2FA
				</span>
			</div>
			<button
				class="font-Poppins bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold py-3 px-5 tracking-wider rounded-lg focus:outline-none focus:shadow-outline"
				type="button">
				Save Changes
			</button>
		</form>
</main></template>
