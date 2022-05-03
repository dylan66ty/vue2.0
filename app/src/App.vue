<template>
  <div id="app">
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
import QRCode from 'qrcode'
export default {
  components: {},
  mounted() {
    var canvas = document.getElementById('canvas')

    QRCode.toCanvas(canvas, '我爱小宝❤', function (error) {
      if (error) console.error(error)
      console.log('success!')
    })
  }
}
</script>


