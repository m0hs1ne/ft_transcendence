<template>
   <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
  <div class="flex">
    <div>
      <p class="font-bold">Create Channel:</p>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Channel Name"
        class="m-1 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
      />
      <input
      type="password"
      v-model="password"
      placeholder="Enter your password"
        class=" m-1 flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
      />
    <button @click="submit">Submit</button>
    </div>
  </div>
</div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isAlertVisible: false
      };
    },
    methods: {
      showAlert() {
        this.isAlertVisible = true;
      }
    }
  };
  </script>
  
  <style>
  .alert {
    background-color: yellow;
    padding: 10px;
    border: 1px solid black;
  }
  </style>