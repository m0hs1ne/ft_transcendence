<template>
    <h1>Logged In</h1>
  </template>
  
  <script lang="ts">
  import Vue from 'vue'
  
  export default Vue.extend({
    async beforeMount() {
      await this.$axios.get('auth/success',{withCredentials: true})
      .then(() => {
        console.log('Logged IN')
      })
      .catch((error) => {
        console.log(error)
        this.$router.push('/')
      })
  },
    name: 'Home',
  })
  </script>
  