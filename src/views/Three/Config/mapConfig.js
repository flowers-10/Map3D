
export const mapConfig = {
  el: 'pc-three-map3D',
  icon: 'icon-ic_map',
  adaptation: 'pc',
  useSource: 'v10', //使用源  v10/v8 ,默认v10
  name: '三维背景地图',
  type: 'chart',
  rootType: 'preset1',
  fetchOptions: {
      dataSource: 2,
      orgSource: 'v10',
      sourceInfo: {
          isClassTarget: 0,
          sourceName: '全部',
          sourceId: '0',
      },
      dateType: 0,
      dimenFormat: 'yyyy-MM',
      pageSize: 0,
      targetDetails: [
          {
              targetShowType: 'main',
              targetId: 46,
              title: '在管项目数',
              type: 86,
              op: 'sum',
              format: {
                  thousandth: false,
                  decimalPlaces: 0,
                  hasUnit: true,
                  unit: '',
              },
              hasPercent: false,
              growth: '',
              sectionType: 1,
              visible: true,
              key: 1700637241778,
              formula: null,
              customizable: false,
              isClassTarget: 0,
          },
      ],
      dimenDetails: [
          {
              dimenId: 'org',
              title: '组织',
              type: 'string',
              format: 0,
              dimenType: 'default',
              reportType: 0,
              visible: true,
              isDataDictionary: false,
              customUrl: null,
              customOptions: null,
          },
      ],
      filterListV: {},
      sortBy: {
          targetId: '',
          desc: 0,
      },
      currentDate: 2023,
  },
  chartOptions: {
      chartName: '三维背景地图', // 内置图形名称
      worldConfig: {
          position: {
              x: -.2,
              y: 0,
              z: 0,
          },
          rotation: {
              x: -0.5,
              y: 0,
              z: 0,
          },
          mapConfig: {
              show: true,
              adcode: 330000, //地图编码
              scale: 0.1,
              series: [
                  {
                      show: true,
                      mapShow: false, // 地图显示
                      lineShow: true, // 是否生成线
                      textShow: false, // 是否生成区域名称
                      name: '轮廓地图',
                      mapId: 0,
                      mapType: 'parentJson', // 类型只有两种 parentJson:当前地区的包含子区域的json,subJson:只包含当前地区的整块json (必填项)
                      shader: false, // 着色器特效开关 (开启影响性能)
                      castShadow: false, // 投射阴影 开启影响性能
                      receiveShadow: false, // 接受阴影 开启影响性能
                      lineConfig: {
                          depth: 0.111, // 线要放到的高度
                          color: '#A0E5FF',
                          linewidth: 0.002,
                      },
                      textConfig: {
                          textType: 'text3D', // text3D （可能有锯齿） or canvas (过滤字体暂未开放)
                          rotation: {
                              x: 0,
                              y: 0,
                              z: 0,
                          },
                          textStyle: {
                              arrangement: 'horizontal',
                              fontSize: 0.02,
                              color: '#ffffff',
                              bold: true,
                              lineHeight: 20,
                              fontFamily: 'Arial',
                          },
                          filterList: ['长宁区', '静安区', '普陀区', '徐汇区', '黄浦区', '虹口区', '杨浦区'], // 需要特殊处理的
                          filterStyle: {
                              arrangement: 'vertical',
                              fontSize: 0.028,
                              color: '#ffffff',
                              bold: true,
                              lineHeight: 20,
                              fontFamily: 'Arial',
                          },
                      },
                      // 拉伸面配置
                      extrudeFacesConfig: {
                          color: '#3EB8F3',
                          transparent: true,
                          metalness: 1,
                          roughness: 1,
                          extrudeSettings: {
                              depth: 0.11, // 地图拉伸深度
                              bevelEnabled: false, //禁止倒角,默认true
                              bevelSegments: 1, //倒圆角：倒角细分精度，默认3
                              bevelSize: 0, //倒角尺寸:垂直拉伸方向
                              bevelThickness: 0, //倒角尺寸:拉伸方向
                          },
                      },
                      // 横截面配置
                      crossSectionConfig: {
                          transparent: true,
                          color: '#2B61A6',
                      },
                  },
                  {
                      show: true, // 总体显示
                      mapShow: true, // 地图显示
                      lineShow: true, // 边框线显示
                      textShow: true, // 地图文字
                      name: '区域地图',
                      mapId: 1,
                      mapType: 'subJson', // 类型
                      shader: true, // 着色器开关
                      castShadow: true,
                      receiveShadow: true,
                      lineConfig: {
                          depth: 0.11, // 线要放到的高度
                          color: '#ffffff',
                          linewidth: 0.001,
                      },
                      textConfig: {
                          textType: 'text3D', // text3D （可能有锯齿） or canvas (过滤字体暂未开放)
                          rotation: {
                              x: 0,
                              y: 0,
                              z: 0,
                          },
                          textStyle: {
                              arrangement: 'horizontal',
                              fontSize: 0.04,
                              color: '#ffffff',
                              bold: true,
                              lineHeight: 20,
                              fontFamily: 'Arial',
                          },
                          filterList: ['长宁区', '静安区', '普陀区', '徐汇区', '黄浦区', '虹口区', '杨浦区'], // 需要特殊处理的
                          filterStyle: {
                              arrangement: 'vertical',
                              fontSize: 0.028,
                              color: '#ffffff',
                              bold: true,
                              lineHeight: 20,
                              fontFamily: 'Arial',
                          },
                      },
                      // 拉伸面配置
                      extrudeFacesConfig: {
                          color: '#3a7abd',
                          transparent: true,
                          metalness: 1,
                          roughness: 1,
                          extrudeSettings: {
                              depth: 0.1, // 地图拉伸深度
                              bevelEnabled: false, //禁止倒角,默认true
                              bevelSegments: 1, //倒圆角：倒角细分精度，默认3
                              bevelSize: 0, //倒角尺寸:垂直拉伸方向
                              bevelThickness: 0, //倒角尺寸:拉伸方向
                          },
                      },
                      // 横截面配置
                      crossSectionConfig: {
                          transparent: true,
                          color: '#2B61A6',
                      },
                  },
              ],
          },
          // 地板配置项
          floorConfig: {
              show: false,
              series: [
                  {
                      id: 1,
                      name: '光环1',
                      map: 'border1Texture',
                      show: true,
                      speed: 1,
                      size: 3,
                      depth: 0,
                      opacity: 0.4,
                  },
                  {
                      id: 2,
                      name: '光环2',
                      map: 'border2Texture',
                      show: true,
                      speed: 1,
                      size: 3,
                      depth: 0,
                      opacity: 0.4,
                  },
                  {
                      id: 3,
                      name: '扩散光环',
                      map: 'focusMoveBgTexture',
                      show: true,
                      speed: 2,
                      size: 2,
                      depth: 0,
                      opacity: 0.7,
                  },
              ],
          },
          // 标签配置项
          spriteConfig: {
              scale: 0.1,
              height: 0.16,
              type: 'random', // random：随机分配颜色, yellow,green,blue统一色
          },
          // 提示框配置项
          tooltipConfig: {
              show: true,
              animation: true,
              duration: 2000,
              type: 'Medium', // Extra-Large：超大，Large：大， Medium：中
              offsetX: 150,
              offsetY: 150,
              background: 'rgba(0, 0, 0, 0.65)',
              filterGroupShow: '',
              filterGroupHide: '',
              allInfo: [
                  { key: 'precinctLocation', targetName: '项目地址', resultValue: '', show: true },
                  { key: 'precinctIntroduction', targetName: '项目简介', resultValue: '', show: true },
                  { key: 'proManager', targetName: '项目经理', resultValue: '', show: true },
                  { key: 'proManagerPhone', targetName: '联系电话', resultValue: '', show: true },
              ],
          },
      },
      // 响应式尺寸配置
      sizeConfig: {
          type: 'parent', // window : 取全局, parent: 取父容器
          id: '_Background_3D', // 父容器ID
      },
      // 后处理配置项(开启影响性能)
      passConfig: {
          type: 'outline', // outline:高亮边,none:普通渲染,bloom:辉光
          outlineConfig: {
              edgeStrength: 3, //边缘强度
              edgeGlow: 1, //缓冲接近
              edgeThickness: 3, //边缘厚度
              pulsePeriod: 2, //脉冲周期
              gamma: true, // 伽马矫正
              antiAliasing: true, // 抗锯齿
              showIndex: 1, // 当前需要展示特效的地图，根据series里的配置项变动
          },
          bloomConfig: {
              strength: 0.8, // 强度参数
              raduis: 0.5, // 半径参数
              threshold: 0.5, // 阈值参数
          },
      },
      // 渲染器配置项
      rendererConfig: {
          antialias: true, //开启抗锯齿 (影响性能)
          alpha: true, // 开启背景透明
          clearAlpha: 0, // 透明背景度
          clearColor: '', // 背景色
      },
      // 相机配置项
      cameraConfig: {
          fov: 75,
          near: 0.1,
          far: 1000,
          position: {
              x: 0,
              y: 0,
              z: 1.6,
          },
          lookAt: true, // 指向原点
          controls: {
              show: true, // 开启控制器
              enableDamping: true, // 开启阻尼
              minPolarAngle: Math.PI * 0.25, // 最小极角
              maxPolarAngle: Math.PI * 0.75, // 最大极角
              minAzimuthAngle: -Math.PI * 0.45, // 最小方位角
              maxAzimuthAngle: Math.PI * 0.25, // 最大方位角
              enablePan: false, // 平移
          },
      },
      // 灯光配置项
      lightConfig: [
          {
              type: 'point', // 点光源
              color: '#3e99e5', // 颜色
              intensity: 3, // 强度
              distance: 500,
              helper: false, // 助手
              lightId: 0,
              lightName: '光源1',
              position: {
                  x: -10,
                  y: 48,
                  z: 50,
              },
          },
          //  实现渐变色
          {
              type: 'point', // 点光源
              color: '#3e99e5', // 颜色
              intensity: 3, // 强度
              distance: 285,
              helper: false, // 助手
              lightId: 1,
              lightName: '光源2',
              position: {
                  x: 1,
                  y: -5,
                  z: 50,
              },
          },
          // 侧边特效打光
          {
              type: 'point', // 点光源
              color: '#3e99e5', // 颜色
              intensity: 10, // 强度
              distance: 285,
              helper: false, // 助手
              lightId: 2,
              lightName: '光源3',
              position: {
                  x: 1,
                  y: -28,
                  z: 3,
              },
          },
      ],
      // 引入外部资源（移除默认值,改动态获取）
      sources: [
          {
              name: 'locationTexture',
              type: 'texture', // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
              path: 'texture/blue-location.png',
          },
          {
              name: 'locationTextureGreen',
              type: 'texture',
              path: 'texture/green-location.png',
          },
          {
              name: 'locationTextureRed',
              type: 'texture',
              path: "texture/red-location.png",
          },
          {
              name: 'locationTextureYellow',
              type: 'texture',
              path: 'texture/yellow-location.png',
          },
          {
              name: 'border1Texture',
              type: 'texture', // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
              path: 'texture/rotationBorder1.png',
          },
          {
              name: 'border2Texture',
              type: 'texture', // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
              path: 'texture/rotationBorder2.png',
          },
          {
              name: 'focusMoveBgTexture',
              type: 'texture', // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
              path: 'texture/focus_move_bg.png',
          },

          {
              name: 'bgTexture',
              type: 'texture',
              path: 'texture/bg.png',
          },
          {
              name: 'fontLang',
              type: 'font',
              path: 'font/TsangerYuYangT_W03_Regular.json',
          },
      ],
  },
}
