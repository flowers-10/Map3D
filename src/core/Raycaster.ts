import * as THREE from 'three'
import ThreeInstance from "./ThreeInstance";
import BaseThree from './BaseThree'

// import { eventBus } from '@BI/utils/eventBus'

export default class Raycaster extends BaseThree{
    public raycaster:THREE.Raycaster;
    constructor(instance: ThreeInstance) {
        super(instance)
        this.raycaster = new THREE.Raycaster()
    }
    update() {
        this.raycaster.setFromCamera(this.mouse, this._camera)
    }
}
