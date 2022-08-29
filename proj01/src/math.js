function cross(a, b) {
    let c1 = a[1]*b[2] - a[2]*b[1]
    let c2 = a[2]*b[0] - a[0]*b[2]
    let c3 = a[0]*b[1] - a[1]*b[0]
    return [c1, c2, c3]
}

function dot(a, b) {
    let res = 0
    if (a.length !== b.length) {
        return 0
    }
    for (let i in a) {
        res += a[i]*b[i]
    }
    return res
}

export function getLineBetweenPoints(a, b) {
    return cross(a, b)
}

export function getIntersectionBetweenLines(a, b) {
    return cross(a, b)
}

export function pointsOnSameSideOfLine(l, a, b) {
    return Math.sign(dot(l, a)) === Math.sign(dot(l, b))
}

export function whichSideOfTheLine(l, a) {
    return Math.sign(dot(l, a))
}