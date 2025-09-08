/**
 * 旋转地图边界JSON数据的工具函数
 * @param {Object} geoJsonData - GeoJSON格式的地图数据
 * @param {number} angle - 旋转角度（度数，正值为顺时针旋转）
 * @param {Array} center - 旋转中心点 [经度, 纬度]，默认为地图中心
 * @returns {Object} 旋转后的GeoJSON数据
 */
export function rotateGeoJSON(geoJsonData, angle, center = null) {
  // 深拷贝原始数据，避免修改原数据
  const rotatedData = JSON.parse(JSON.stringify(geoJsonData))
  
  // 将角度转换为弧度
  const radians = (angle * Math.PI) / 180
  
  // 如果没有指定旋转中心，计算地图的中心点
  if (!center) {
    center = calculateGeoJSONCenter(geoJsonData)
  }
  
  const [centerLon, centerLat] = center
  
  // 旋转单个坐标点
  function rotatePoint(coordinates) {
    const [lon, lat] = coordinates
    
    // 将坐标转换为相对于中心点的坐标
    const x = lon - centerLon
    const y = lat - centerLat
    
    // 应用旋转矩阵
    const rotatedX = x * Math.cos(radians) - y * Math.sin(radians)
    const rotatedY = x * Math.sin(radians) + y * Math.cos(radians)
    
    // 转换回绝对坐标
    return [rotatedX + centerLon, rotatedY + centerLat]
  }
  
  // 递归处理坐标数组
  function rotateCoordinates(coords) {
    if (typeof coords[0] === 'number') {
      // 这是一个坐标点 [lon, lat]
      return rotatePoint(coords)
    } else {
      // 这是一个坐标数组，递归处理
      return coords.map(rotateCoordinates)
    }
  }
  
  // 处理每个feature的geometry
  if (rotatedData.features) {
    rotatedData.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        feature.geometry.coordinates = rotateCoordinates(feature.geometry.coordinates)
      }
      
      // 同时旋转properties中的center和centroid点
      if (feature.properties) {
        if (feature.properties.center) {
          feature.properties.center = rotatePoint(feature.properties.center)
        }
        if (feature.properties.centroid) {
          feature.properties.centroid = rotatePoint(feature.properties.centroid)
        }
      }
    })
  }
  
  return rotatedData
}

/**
 * 计算GeoJSON数据的中心点
 * @param {Object} geoJsonData - GeoJSON数据
 * @returns {Array} 中心点坐标 [经度, 纬度]
 */
function calculateGeoJSONCenter(geoJsonData) {
  let minLon = Infinity, maxLon = -Infinity
  let minLat = Infinity, maxLat = -Infinity
  
  // 递归遍历所有坐标点
  function processCoordinates(coords) {
    if (typeof coords[0] === 'number') {
      // 这是一个坐标点
      const [lon, lat] = coords
      minLon = Math.min(minLon, lon)
      maxLon = Math.max(maxLon, lon)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    } else {
      // 这是一个坐标数组
      coords.forEach(processCoordinates)
    }
  }
  
  if (geoJsonData.features) {
    geoJsonData.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        processCoordinates(feature.geometry.coordinates)
      }
    })
  }
  
  // 返回边界框的中心点
  return [(minLon + maxLon) / 2, (minLat + maxLat) / 2]
}

/**
 * 批量旋转多个角度，生成多个旋转版本
 * @param {Object} geoJsonData - 原始GeoJSON数据
 * @param {Array} angles - 角度数组
 * @param {Array} center - 旋转中心点
 * @returns {Array} 旋转后的GeoJSON数据数组
 */
export function rotateGeoJSONBatch(geoJsonData, angles, center = null) {
  return angles.map(angle => rotateGeoJSON(geoJsonData, angle, center))
}

/**
 * 创建旋转动画帧数据
 * @param {Object} geoJsonData - 原始GeoJSON数据
 * @param {number} totalAngle - 总旋转角度
 * @param {number} frames - 动画帧数
 * @param {Array} center - 旋转中心点
 * @returns {Array} 动画帧数据数组
 */
export function createRotationAnimation(geoJsonData, totalAngle = 360, frames = 60, center = null) {
  const angleStep = totalAngle / frames
  const angles = Array.from({ length: frames }, (_, i) => i * angleStep)
  return rotateGeoJSONBatch(geoJsonData, angles, center)
}