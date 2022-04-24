const callbacks = []
let actived

function flashCallback() {
  callbacks.forEach(cb => cb())
  callbacks.length = 0
  actived = false
}



export function nextTick(callback) {
  callbacks.push(callback)
  if (actived) return
  actived = true
  setTimeout(flashCallback, 0);



}