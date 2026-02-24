import gsap from 'gsap'
import MapControlStudy from '.'

export function initGsapTimeLine(this: MapControlStudy) {
  const timeLine = gsap.timeline()
  timeLine.addLabel('focusMap', 2)
  timeLine.addLabel('focusMapOpacity', 2.5)
  timeLine.addLabel('bar', 3.5)
  timeLine.add(
    gsap.to(this.camera.instance!.position, {
      duration: 2.5,
      x: -20.460391656828197,
      y: 19.30487264306655,
      z: 58.37802626943616,
      ease: 'circ.out',
    }),
  )
  timeLine.add(
    gsap.to(this.camera.instance!.position, {
      duration: 2.5,
      x: -0.2515849818960619,
      y: 12.397744557047988,
      z: 14.647659671139275,
      ease: 'circ.out',
    }),
  )

  if (this.rotateBorder1 && this.rotateBorder2) {
    timeLine.to(
      this.rotateBorder1.scale,
      {
        delay: 0.3,
        duration: 2,
        x: 1,
        y: 1,
        z: 1,
        ease: 'circ.out',
      },
      'focusMapOpacity',
    )
    timeLine.to(
      this.rotateBorder2.scale,
      {
        duration: 2,
        x: 1,
        y: 1,
        z: 1,
        ease: 'circ.out',
      },
      'focusMapOpacity',
    )
  }

  if (this.focusMapGroup) {
    timeLine.to(
      this.focusMapGroup.position,
      {
        duration: 2,
        x: 0,
        y: 0,
        z: 0,
        ease: 'circ.out',
      },
      'focusMapOpacity',
    )
    timeLine.to(
      this.focusMapGroup.scale,
      {
        duration: 2,
        x: 1,
        y: 1,
        z: 1,
        ease: 'circ.out',
      },
      'focusMapOpacity',
    )
  }

  if (this.focusMapTopMaterial) {
    timeLine.to(
      this.focusMapTopMaterial,
      {
        duration: 2,
        opacity: 1,
      },
      'focusMapOpacity',
    )
  }

  if (this.zhejiangLineMaterial) {
    timeLine.to(
      this.zhejiangLineMaterial,
      {
        duration: 2,
        opacity: 1,
      },
      'focusMapOpacity',
    )
  }

  if (this.labels) {
    this.labels.map((e, i) => {
      const r = e.element.querySelector('.other-label')
      timeLine.to(
        r,
        {
          duration: 1,
          delay: 0.1 * i,
          translateY: 0,
          opacity: 1,
          ease: 'circ.out',
        },
        'focusMapOpacity',
      )
    })
  }

  // 柱状图动画
  this.allBar.map((e, i) => {
    timeLine.add(
      gsap.to(e.scale, {
        duration: 1,
        delay: 0.1 * i,
        x: 1,
        y: 1,
        z: 1,
        ease: 'circ.out',
      }),
      'bar',
    )
  })

  this.allBarMaterial.map((e, i) => {
    timeLine.add(
      gsap.to(e, {
        duration: 1,
        delay: 0.1 * i,
        opacity: 1,
        ease: 'circ.out',
      }),
      'bar',
    )
  })
  this.allProvinceLabel.map((e, i) => {
    const r = e.element.querySelector('.provinces-label-wrap')
    const c = e.element.querySelector('.number .value')
    const o = Number(c?.textContent)
    const l = {score: 0}
    timeLine.add(
      gsap.to(r, {
        duration: 1,
        delay: 0.2 * i,
        translateY: 0,
        opacity: 1,
        ease: 'circ.out',
      }),
      'bar',
    )
    const p = gsap.to(l, {
      duration: 1,
      delay: 0.2 * i,
      score: o,
      onUpdate: n,
    })
    function n() {
      c!.textContent = l.score.toFixed(0)
    }
    timeLine.add(p, 'bar')
  })
  // 光圈动画
  this.allGuangquan.map((e, i) => {
    timeLine.add(
      gsap.to(e.children[0].scale, {
        duration: 1,
        delay: 0.1 * i,
        x: 1,
        y: 1,
        z: 1,
        ease: 'circ.out',
      }),
      'bar',
    )
    timeLine.add(
      gsap.to(e.children[1].scale, {
        duration: 1,
        delay: 0.1 * i,
        x: 1,
        y: 1,
        z: 1,
        ease: 'circ.out',
      }),
      'bar',
    )
  })
}
