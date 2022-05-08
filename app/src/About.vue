<template>
  <div>
    <div>{{ message }}</div>
    <div>{{ name }}</div>
    <button @click="onChange">Change</button>
  </div>
</template>

<script>
export default {
  props: {
    message: String
  },
  data() {
    return {
      name: 'dy'
    }
  },
  updated() {
    console.log('updated')
  },
  mounted() {
    console.log('on mounted')
  },
  methods: {
    onChange() {
      this.$emit('change')
    }
  }
}
</script>

<style>
</style>