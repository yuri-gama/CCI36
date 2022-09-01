import { pointInPolygon } from './polygon.js'
import {extractEdgesFromMesh    } from './mesh.js'
import {angleBetweenVectors} from "./math.js";

export class Tracker {
    constructor(meshes, projector) {
        this.meshes = meshes
        this.projector = projector
        this.currentMesh = null
        this.enabled = false
        this.worldMousePos = null
        this.meshLastPos = null
        this.rotateEnable = false
        this.worldMousePosRotate = null
    }

    enable(mousePos, rotateEnable) {
        this.rotateEnable = rotateEnable
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
        this.rotateEnable = false
        this.currentMesh = null
    }

    track(mousePos) {
        if (!this.enabled || !this.currentMesh) {
            return
        }

        let worldMousePos = this.projector.projectWindowIntoWorld(mousePos)
        if (!this.rotateEnable) {
            this.currentMesh.position.setX(this.meshLastPos[0] + worldMousePos[0] - this.worldMousePos[0])
            this.currentMesh.position.setY(this.meshLastPos[1] + worldMousePos[1] - this.worldMousePos[1])
        }
        else{
            let old_position = this.currentMesh.worldToLocal(new THREE.Vector3(...this.worldMousePosRotate, 0))
            let new_position = this.currentMesh.worldToLocal(new THREE.Vector3(...worldMousePos, 0))

            const angleRotate = angleBetweenVectors([old_position.x, old_position.y], [new_position.x, new_position.y])

            if (!isNaN(angleRotate)) {
                this.rotate(angleRotate)
                this.worldMousePosRotate = worldMousePos

            }

        }
        this.currentMesh.geometry.attributes.position.needsUpdate = true
    }

    rotate(theta){
        if (!this.enabled || !this.currentMesh || !this.rotateEnable) {
            return
        }
       
        this.currentMesh.rotateZ(theta)
       
    }

    setPos(mousePos){
        this.worldMousePosRotate = this.projector.projectWindowIntoWorld(mousePos)

    }
}