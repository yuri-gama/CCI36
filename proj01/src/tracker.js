import { pointInMesh } from './polygon.js'

export class Tracker {
    constructor(meshes, camera) {
        this.meshes = meshes
        this.camera = camera
        this.currentMesh = null
        this.enabled = false
        this.mousePos = null
    }

    enable(mousePos) {
        this.enabled = true
        this.mousePos = mousePos

        for (let mesh of this.meshes) {
            if (pointInMesh(this.mousePos, mesh, this.camera)) {
                console.log('yes')
                this.currentMesh = mesh
            }
        }
    }

    disable() {
        this.enabled = false
        this.currentMesh = null
    }

    track(mousePos) {
        if (!this.enabled || !this.mousePos || !this.currentMesh) {
            return
        }

        this.currentMesh.position.x += mousePos[0] - this.mousePos[0]
        this.currentMesh.position.y += mousePos[1] - this.mousePos[1]
        this.mousePos = mousePos
    }
}