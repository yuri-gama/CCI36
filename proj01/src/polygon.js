import {
    getLineBetweenPoints,
    getIntersectionBetweenLines,
    pointsOnSameSideOfLine,
    segmentsIntersect,
    pointInPositiveSide,
    toProjective,
    toCartesian
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



export function clippingSutherlandHodgman(clippingEdges, polygonEdges) {
    let clippedPolygonEdges = [...polygonEdges]
    // console.log("c verde")

    for (const clippingEdge of clippingEdges) {
        let cA = toProjective(clippingEdge.first)
        let cB = toProjective(clippingEdge.second)
        let line = getLineBetweenPoints(cA, cB)

        let nextPolygonEdges = []
        let waitingPoint = null
        let lastPoint = null

        // console.log("clipped", clippedPolygonEdges)
        // console.log("cA " + cA)
        // console.log("cB " + cB)
        for (const polygonEdge of clippedPolygonEdges) {

            let pA = toProjective(polygonEdge.first)
            let pB = toProjective(polygonEdge.second)
            // console.log("pA " + pA)
            // console.log("pB " + pB)
            if (pointsOnSameSideOfLine(line, pA, pB)) {
                // console.log("same side")
                if (!pointInPositiveSide(line, pA)) {
                    // console.log("negative side -- adding to the clipping")
                    nextPolygonEdges.push(polygonEdge)
                } else {
                    // console.log("positive side -- removing from the clipping")
                }
            } else {
                // console.log("different side")
                let segment = getLineBetweenPoints(pA, pB)
                let intersection = toCartesian(getIntersectionBetweenLines(segment, line))
                if (!pointInPositiveSide(line, pA)) 
                {
                    // console.log("negative side: adding (pA, inter)")
                    nextPolygonEdges.push({first: toCartesian(pA), second: intersection})
                    waitingPoint = intersection
                } else {
                    // console.log("positive side: adding (inter, pB)")
                    if (waitingPoint)
                        nextPolygonEdges.push({first: waitingPoint, second: intersection})
                    else
                        lastPoint = intersection
                    nextPolygonEdges.push({first: intersection, second: toCartesian(pB)})
                    waitingPoint = null
                }
            }
        }

        if (lastPoint && waitingPoint)
            nextPolygonEdges.push({first: waitingPoint, second: lastPoint})

        clippedPolygonEdges = nextPolygonEdges
    }

    return clippedPolygonEdges
}


export function area(edges) {
    let area = 0
    for (const { first: a, second: b} of edges)
        area += (b[0] - a[0])*(b[1] + a[1])
    return area/2
}