<!-- TextField.vue -->
<template>
    <input v-model="inputValue" :placeholder="placeholder"
        :class="{ 'border-red-500': showError }" 
        @input="handleInput"
        class="border rounded p-2 focus:outline-none focus:ring focus:border-blue-300 transition duration-300" />
</template>
  
<script>
export default {
    props: {
        value: String,
        placeholder: String,
        showError: Boolean,
    },
    data() {
        return {
            inputValue: this.value,
        };
    },
    methods: {
        handleInput() {
            this.$emit('input', this.inputValue);
        },
    },
};
</script>
  