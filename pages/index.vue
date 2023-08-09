<template>
  <LoginForm />
</template>

<script lang="ts">
import Vue from 'vue'
import LoginForm from '~/components/LoginForm.vue';

export default Vue.extend({
    name: 'IndexPage',
    components: { LoginForm }
})
</script>
