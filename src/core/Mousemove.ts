import * as THREE from "three";
import EventEmitter from "./EventEmitter";

export default class Mousemove extends EventEmitter {
  private canvas: HTMLCanvasElement;
  public eventOffset: { x: number; y: number };
  public mouse: THREE.Vector2;
  private mouseMoveHandler: (event: MouseEvent) => void;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.eventOffset = {
      x: 0,
      y: 0,
    };
    this.mouse = new THREE.Vector2();
    this.mouseMoveHandler = (event) => {
      // 父级并非满屏，所以需要减去父级的left 和 top
      let {
        top = 0,
        left = 0,
        width = 0,
        height = 0,
      } = this.canvas?.getBoundingClientRect();
      let clientX = event.clientX - left;
      let clientY = event.clientY - top;

      this.mouse.x = (clientX / width) * 2 - 1;
      this.mouse.y = -(clientY / height) * 2 + 1;

      this.eventOffset.x = clientX;
      this.eventOffset.y = clientY;
      this.trigger("mousemove", null);
    };

    this.canvas
      ? window.addEventListener("mousemove", this.mouseMoveHandler, false)
      : null;
  }

  release() {
    window.removeEventListener("mousemove", this.mouseMoveHandler, false);
  }
}
