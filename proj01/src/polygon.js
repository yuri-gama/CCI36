function arrayString(a) {
    let aStr = ""
    for (let i in a) {
        aStr += a[i].toString()
    }
    return aStr
}

export function extractPointsFromMesh(mesh) {
    let edges = new THREE.EdgesGeometry(mesh.geometry).attributes.position.array;

    let vertexMap = new Map();
    for (let i = 0; i < edges.length; i += 6) {
        vertexMap.set(arrayString([edges[i], edges[i + 1]]), [edges[i + 3], edges[i + 4]]);
    }

    let first = [edges[0], edges[1]], vertexes = [first]
    for (
        let vertex = vertexMap.get(arrayString(first));
        arrayString(vertex) !== arrayString(first);
        vertex = vertexMap.get(arrayString(vertex))
    ) {
        vertexes.push(vertex)
    }

    return vertexes
}