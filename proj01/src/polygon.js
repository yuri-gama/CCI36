import {
    segmentsIntersect
} from './math.js'

export function pointInPolygon(point, edges) {

    let intersections = 0
    for (const edge of edges) {
        if (segmentsIntersect([...point, 1], [...point, 0], [...edge.first, 1], [...edge.second, 1])) {
            intersections++
        }
    }
    return (intersections%2 === 1)
}