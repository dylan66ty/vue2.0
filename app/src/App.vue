<template>
  <div id="app">
    <el-button
      ref="btn"
      @mouseenter.native="handleMouseEnter"
      @mouseleave.native="handleMouseLeave"
      >Button
    </el-button>
  </div>
</template>
<script>
import { DatePicker } from 'element-ui'
import Vue from 'vue'
export default {
  data() {
    return {}
  },
  mounted() {
    const Ctor = Vue.extend(DatePicker)

    const instance = new Ctor({
      propsData: {
        valueFormat: 'yyyy-MM-dd',
        type: 'date',
        value: '2022-04-07'
      }
    })
    instance.$on('input', (val) => {
      instance.value = val
    })
    instance.$mount()
    instance.$refs.reference.$el = this.$refs.btn.$el
    instance.mountPicker()
    this.instance = instance
    console.log(instance)

    instance.picker.$el.addEventListener('mouseenter', () => {
      this.handleMouseEnter()
    })
    instance.picker.$el.addEventListener('mouseleave', () => {
      this.handleMouseLeave()
    })
  },
  methods: {
    handleMouseEnter() {
      clearTimeout(this.timer)
      this.instance.showPicker()
    },

    handleMouseLeave() {
      this.timer = setTimeout(() => {
        this.instance.hidePicker()
      }, 100)
    }
  }
}
</script>

<style scoped>
.date {
  display: none;
}
</style>


