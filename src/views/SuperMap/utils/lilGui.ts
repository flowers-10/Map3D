import {GUI} from 'lil-gui'

class LilGui {
  active: boolean
  instance?: GUI
  constructor(bool = false) {
    this.active = bool
    window.location.hash === '#debug' && (this.active = true)
    if (this.active) {
      this.instance = new GUI()
      this.instance.close()
    }
  }
  update() {}
  destroy() {
    this.active && this.instance?.destroy()
  }
}

export default LilGui
