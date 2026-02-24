import * as THREE from 'three'

/**
 * 创建一个带动画视频材质的网格平面
 * @param selector - 视频元素的CSS选择器
 * @param position - 平面在场景中的位置
 * @returns 带视频纹理的网格对象
 */
function createAnimateVideoItem(
  selector: string,
  position: THREE.Vector3,
): THREE.Mesh | null {
  // 获取视频元素
  const videoElement = document.querySelector(selector) as HTMLVideoElement
  if (!videoElement) return null

  // 添加鼠标事件，点击时播放视频
  window.addEventListener('pointerdown', () => {
    if (videoElement) {
      videoElement.play()
    }
  })

  // 创建视频纹理
  const videoTexture = new THREE.VideoTexture(videoElement)
  videoTexture.colorSpace = THREE.SRGBColorSpace

  // 缩放系数
  const scaleFactor = 1.2

  // 创建平面几何体 (宽度为高度的2.5倍)
  const planeGeometry = new THREE.PlaneGeometry(
    2.5 * scaleFactor,
    1 * scaleFactor,
  )

  // 创建带透明度的材质，使用视频作为透明度贴图
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 10807286, // 浅青色
    alphaMap: videoTexture,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending, // 加法混合模式，增强亮度
  })

  // 创建网格并设置属性
  const videoMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  videoMesh.rotateX(-Math.PI / 2) // 旋转为水平放置
  videoMesh.position.copy(position)
  videoMesh.renderOrder = 10 // 设置渲染顺序，确保正确的透明度处理

  return videoMesh
}

export default createAnimateVideoItem
