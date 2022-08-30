import { getIntersectionBetweenLines, getLineBetweenPoints, pointsOnSameSideOfLine } from './math.js'

function extractEdgesFromMesh(mesh, camera) {
    let edgeArray = new THREE.EdgesGeometry(mesh.geometry).attributes.position.array;

    let edges = []
    for (let i = 0; i < edgeArray.length; i += 6) {
        camera.updateMatrixWorld()
        let vertexes = [
            new THREE.Vector3(edgeArray[i], edgeArray[i + 1], edgeArray[i + 2]),
            new THREE.Vector3(edgeArray[i + 3], edgeArray[i + 4], edgeArray[i + 5]),
        ]
        let halfWidth = window.innerWidth/2,
            halfHeight = window.innerHeight/2
        for (let v of vertexes) {
            mesh.localToWorld(v)
            v.project(camera)
            v.x = (v.x*halfWidth) + halfWidth
            v.y = -(v.y*halfHeight) + halfHeight
        }
        edges.push({
            first: [vertexes[0].x, vertexes[0].y],
            second: [vertexes[1].x, vertexes[1].y],
        })
    }
    return edges
}

export function pointInMesh(point, mesh, camera) {
    let edges = extractEdgesFromMesh(mesh, camera),
        hRay = getLineBetweenPoints([...point, 1], [...point, 0]),
        hPerpendicularRay = getLineBetweenPoints([...point, 1], [-point[1], point[0], 0]),
        rayOrientation = [...point, 0.5]

    let intersections = 0
    for (const edge of edges) {
        let hEdge = getLineBetweenPoints([...edge.first, 1], [...edge.second, 1]),
            hIntersection = getIntersectionBetweenLines(hEdge, hRay)
        if (pointsOnSameSideOfLine(hPerpendicularRay, hIntersection, rayOrientation)) {
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