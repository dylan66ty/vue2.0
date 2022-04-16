const addRouteRecord = (route, pathList, pathMap, parentRecord) => {
  const path = parentRecord ? `${parentRecord.path}/${route.path}` : route.path
  let record = {
    path,
    component: route.component,
    parent: parentRecord
    //...
  }
  if (!pathMap[path]) { // 重复定义的路由以用户第一个为准
    pathMap[path] = record
    pathList.push(path)
  }

  if (route && route.children) {
    // 递归
    route.children.forEach(child => {
      addRouteRecord(child, pathList, pathMap, record)
    })
  }


}

export default function createRouteMap(routes, oldPathList, oldPathMap) {
  const pathList = oldPathList || []
  const pathMap = oldPathMap || []

  routes.forEach(route => {
    addRouteRecord(route, pathList, pathMap, null)
  })



  return {
    pathList,
    pathMap
  }


}