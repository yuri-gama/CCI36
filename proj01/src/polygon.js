import { getIntersectionBetweenLines, getLineBetweenPoints, pointsOnSameSideOfLine, whichSideOfTheLine } from './math.js'

function extractEdgesFromMesh(mesh) {
    let edgeArray = new THREE.EdgesGeometry(mesh.geometry).attributes.position.array;

    let edges = []
    for (let i = 0; i < edgeArray.length; i += 6) {
        edges.push({
            first: [edgeArray[i], edgeArray[i + 1]],
            second: [edgeArray[i + 3], edgeArray[i + 4]],
        })
    }
    return edges
}

export function pointInMesh(point, mesh) {
    let edges = extractEdgesFromMesh(mesh),
        hRay = getLineBetweenPoints([...point, 1], [...point, 0]),
        hPerpendicularRay = getLineBetweenPoints([...point, 1], [-point[1], point[0], 0]),
        rayOrientation = 1

    let intersections = 0
    for (const edge of edges) {
        let hEdge = getLineBetweenPoints(edge.first, edge.second),
            hIntersection = getIntersectionBetweenLines(hEdge, hRay)
        if (whichSideOfTheLine(hPerpendicularRay, hIntersection) !== rayOrientation) {
            continue
        }

        let hFirstPerpendicularEdge = getLineBetweenPoints([...edge.first, 1], [hEdge[0], hEdge[1], 0]),
            hSecondPerpendicularEdge = getLineBetweenPoints([...edge.second, 1], [hEdge[0], hEdge[1], 0])

        if (pointsOnSameSideOfLine(hFirstPerpendicularEdge, hIntersection, [...edge.second, 1]) &&
            pointsOnSameSideOfLine(hSecondPerpendicularEdge, hIntersection, [...edge.first, 1])) {
            intersections++
        }
    }
    return (intersections%2 === 1)
}