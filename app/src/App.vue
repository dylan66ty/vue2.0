<template>
  <div id="app">
    <my></my>
    <my></my>
    <my></my>
    <my1></my1>
    <my1></my1>
    <my1></my1>
  </div>
</template>
<script>
export default {
  components: {
    my1: {
      render() {
        console.log(this.$vnode)
        return <div>my1</div>
      }
    }
  }
}
</script>


