import { pointInPolygon } from './polygon.js'
import { extractEdgesFromMesh } from './mesh.js'

export class Tracker {
    constructor(meshes, projector) {
        this.meshes = meshes
        this.projector = projector
        this.currentMesh = null
        this.enabled = false
        this.worldMousePos = null
        this.meshLastPos = null
    }

    enable(mousePos) {
        this.enabled = true
        this.worldMousePos = this.projector.projectWindowIntoWorld(mousePos)

        for (let mesh of this.meshes) {
            let worldEdges = extractEdgesFromMesh(mesh), canvasEdges = []
            for (let worldEdge of worldEdges) {
                canvasEdges.push({
                    first: this.projector.projectWorldIntoCanvas(worldEdge.first),
                    second: this.projector.projectWorldIntoCanvas(worldEdge.second)
                })
            }
            if (pointInPolygon(this.projector.projectWindowIntoCanvas(mousePos), canvasEdges)) {
                this.currentMesh = mesh
                this.meshLastPos = [this.currentMesh.position.x, this.currentMesh.position.y]
            }
        }
    }

    disable() {
        this.enabled = false
        this.currentMesh = null
    }

    track(mousePos) {
        if (!this.enabled || !this.currentMesh) {
            return
        }

        let worldMousePos = this.projector.projectWindowIntoWorld(mousePos)
        this.currentMesh.position.setX(this.meshLastPos[0] + worldMousePos[0] - this.worldMousePos[0])
        this.currentMesh.position.setY(this.meshLastPos[1] + worldMousePos[1] - this.worldMousePos[1])
        this.currentMesh.geometry.attributes.position.needsUpdate = true
    }
}