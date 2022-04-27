import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.component('my', {
  render() {
    console.log(this.$vnode)
    return <div>dadad</div>
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
