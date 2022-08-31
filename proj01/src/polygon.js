import {
    getIntersectionBetweenLines,
    getLineBetweenPoints,
    pointsOnSameSideOfLine,
    pointBetweenPoints
} from './math.js'

export function pointInPolygon(point, edges) {
    let hRay = getLineBetweenPoints([...point, 1], [...point, 0]),
        hPerpendicularRay = getLineBetweenPoints([...point, 1], [-point[1], point[0], 0]),
        rayOrientation = [...point, 0.5]

    let intersections = 0
    for (const edge of edges) {
        let hEdge = getLineBetweenPoints([...edge.first, 1], [...edge.second, 1]),
            hIntersection = getIntersectionBetweenLines(hEdge, hRay)
        if (pointsOnSameSideOfLine(hPerpendicularRay, hIntersection, rayOrientation)) {
            continue
        }

        if (pointBetweenPoints(hIntersection, [...edge.first, 1], [...edge.second, 1])) {
            intersections++
        }
    }
    return (intersections%2 === 1)
}