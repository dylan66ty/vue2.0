let callbacks = []
let actived

function flashCallback() {
  callbacks.forEach(cb => cb())
  actived = false
}



export function nextTick(callback) {
  callbacks.push(callback)
  if (actived) return
  actived = true
  setTimeout(flashCallback, 0);



}