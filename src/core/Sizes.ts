import EventEmitter from "./EventEmitter";
import { SizeConfigType } from "./types/ConfigOptType";

export default class Sizes extends EventEmitter {
  public width: number;
  public height: number;
  public pixelRatio: number;
  private resizeHandler: () => void;
  constructor(config: SizeConfigType) {
    super();
    this.width = 100;
    this.height = 100;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.resizeHandler = () => {
      if (config.type === "parent") {
        const dom = document.getElementById(config.id);
        if (dom) {
          const container = dom.parentElement;
          if (container) {
            this.width = container.clientWidth;
            this.height = container.clientHeight;
          } else {
            console.error(
              "tips: The parent document cannot be found. Please put the current component inside the parent document ID according to the configuration item."
            );
          }
        } else {
          this.release();
          console.error(
            "tips: Could not find parent element ID, please check the configuration"
          );
        }
      } else {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      }
      console.log(this.width, this.height,11111);
      
      this.trigger("resize", null);
    };
    this.resizeHandler();
    window.addEventListener("resize", this.resizeHandler);
  }
  info(message = "Now size") {
    console.log(message, 'width:',this.width,'height:', this.height);
  }
  release() {
    window.removeEventListener("resize", this.resizeHandler);
  }
}
