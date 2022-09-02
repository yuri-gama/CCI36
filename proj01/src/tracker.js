import { pointInPolygon, area, clippingSutherlandHodgman } from "./polygon.js";
import { extractEdgesFromMesh } from "./mesh.js";
import { angleBetweenVectors } from "./math.js";

export class Tracker {
    constructor(meshes, plane, projector) {
        this.meshes = meshes;
        this.plane = plane;
        this.projector = projector;
        this.currentMesh = null;
        this.enabled = false;
        this.worldMousePos = null;
        this.meshLastPos = null;
        this.rotateEnable = false;
        this.worldMousePosRotate = null;
    }

    meshToCanvas(mesh) {
        let worldEdges = extractEdgesFromMesh(mesh),
            canvasEdges = [];

        for (let worldEdge of worldEdges) {
            canvasEdges.push({
                first: this.projector.projectWorldIntoCanvas(worldEdge.first),
                second: this.projector.projectWorldIntoCanvas(worldEdge.second),
            });
        }
        return canvasEdges
    }

    enable(mousePos) {
        this.enabled = true;
        this.worldMousePos = this.projector.projectWindowIntoWorld(mousePos);

        if (!this.rotateEnable)
            this.worldMousePosRotate = this.projector.projectWindowIntoWorld(mousePos);

        for (let mesh of this.meshes) {
            let canvasEdges = this.meshToCanvas(mesh)
            if (pointInPolygon(this.projector.projectWindowIntoCanvas(mousePos), canvasEdges)) {
                this.currentMesh = mesh;
                this.meshLastPos = [this.currentMesh.position.x, this.currentMesh.position.y];
            }
        }
    }

    disable() {
        this.enabled = false;
        this.rotateEnable = false;
        this.currentMesh = null;
    }

    enableRotation() {
        // if (!this.rotateEnable) {
        //     this.projector.projectWindowIntoWorld(mousePos)
        //     this.worldMousePosRotate = new THREE.Vector3(0,0,0)
        // }
        this.rotateEnable = true;
    }

    disableRotation() {
        this.rotateEnable = false;
    }

    track(mousePos) {
        if (!this.enabled || !this.currentMesh) {
            return;
        }

        let worldMousePos = this.projector.projectWindowIntoWorld(mousePos);
        if (!this.rotateEnable) {
            this.currentMesh.position.setX(
                this.meshLastPos[0] + worldMousePos[0] - this.worldMousePos[0]
            );
            this.currentMesh.position.setY(
                this.meshLastPos[1] + worldMousePos[1] - this.worldMousePos[1]
            );
        } else {
            let old_position = this.currentMesh.worldToLocal(
                new THREE.Vector3(...this.worldMousePosRotate, 0)
            );
            let new_position = this.currentMesh.worldToLocal(
                new THREE.Vector3(...worldMousePos, 0)
            );

            const angleRotate = angleBetweenVectors(
                [old_position.x, old_position.y],
                [new_position.x, new_position.y]
            );

            if (!isNaN(angleRotate)) {
                this.rotate(angleRotate);
                this.worldMousePosRotate = worldMousePos;
            }
        }
        this.currentMesh.geometry.attributes.position.needsUpdate = true;
    }

    rotate(theta) {
        if (!this.enabled || !this.currentMesh || !this.rotateEnable) {
            return;
        }

        this.currentMesh.rotateZ(theta);
    }

    setPos(mousePos) {
        this.worldMousePosRotate = this.projector.projectWindowIntoWorld(mousePos);
    }

    area() {
        let planeEdges = this.meshToCanvas(this.plane),
            coveredArea = 0 

        for (const mesh of this.meshes) {
            let edges = this.meshToCanvas(mesh),
                intersection = clippingSutherlandHodgman(edges, planeEdges)
            coveredArea += area(intersection)

            for (const otherMesh of this.meshes) {
                if (otherMesh === mesh) {
                    continue;
                }
                let otherEdges = this.meshToCanvas(otherMesh),
                    intersection = clippingSutherlandHodgman(edges, otherEdges)
                coveredArea -= area(intersection)
            }
        }
        return coveredArea/area(planeEdges)
    }

}
