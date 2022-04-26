import createRouteMap from './create-route-map'
import { createRoute } from './history/base'

export default function createMatcher(routes) {
  const { pathList, pathMap } = createRouteMap(routes)

  function match(location) {
    const record = pathMap[location]
    return createRoute(record, { path: location })
  }


  function addRoutes() {
    createMatcher(routes, pathList, pathMap)
  }

  return {
    match,
    addRoutes
  }

}