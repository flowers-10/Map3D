export const mapConfig = {
  el: "pc-three-map3D",
  icon: "icon-ic_map",
  adaptation: "pc",
  useSource: "v10", //使用源  v10/v8 ,默认v10
  name: "三维背景地图",
  type: "chart",
  rootType: "chart",
  fetchOptions: {
    //数据源，0-指标库，1-表单，2-dataCenter
    dataSource: 2,
    orgSource: "v10",
    sourceInfo: {
      isClassTarget: 0,
      sourceName: "",
      sourceId: "",
    },
    // 模拟化+模拟化数据
    openAutoFetch: false,
    autoFetchTimer: 60000 * 60, // 一小时进行更新
    dateType: 0,
    dimenFormat: "yyyy-MM", // 展示维度类型0:年  1:半年  2:季  3:月
    pageSize: 0,
    //指标详情
    targetDetails: [],
    //维度详情
    dimenDetails: [],
    filterListV: {},
    //排序方式
    sortBy: {
      targetId: "", //排序依据的指标id
      desc: 0, //是否降序，0-默认，1-降序，2-升序
    },
  },
  chartOptions: {
    chartName: "三维背景地图", // 内置图形名称
    worldConfig: {
      mapConfig: {
        show: true,
        adcode: 310000, //地图编码
        series: [
          {
            show: true,
            mapShow: true, // 地图显示
            lineShow: true, // 是否生成线
            textShow: false, // 是否生成区域名称
            name: "allMap",
            mapType: "parentJson", // 类型只有两种 parentJson:当前地区的包含子区域的json,subJson:只包含当前地区的整块json, (必传项)
            shader: true, // 着色器特效开关 (开启影响性能)
            castShadow: false, // 投射阴影 开启影响性能
            receiveShadow: false, // 接受阴影 开启影响性能
            lineConfig: {
              depth: 0.11, // 线要放到的高度
              color: "#A0E5FF",
              linewidth: 0.002,
            },
            textConfig: {
              textStyle: {
                fontSize: 0.04,
                color: "#ffffff",
              },
            },
            // 拉伸面配置
            extrudeFacesConfig: {
              color: ["#3EB8F3"],
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
              color: ["#2B61A6", "#0B2230"],
            },
          },
          {
            show: true, // 总体显示
            mapShow: false, // 地图显示
            lineShow: true, // 是否生成线
            textShow: true, // 地图文字
            name: "regionMap",
            mapType: "subJson", // 类型
            shader: false, // 着色器开关
            castShadow: true,
            receiveShadow: true,
            lineConfig: {
              depth: 0.11, // 线要放到的高度
              color: "#ffffff",
              linewidth: 0.001,
            },
            textConfig: {
              textStyle: {
                fontSize: 0.04,
                color: "#ffffff",
              },
            },
            // 拉伸面配置
            extrudeFacesConfig: {
              color: ["#3a7abd"],
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
              color: ["#2B61A6", "#0E2649"],
            },
          },
        ],
      },
      // 标签配置项
      // data example: { x:经度,y:纬度,texture:纹理,scaleX:x大小倍率,scaleY:y倍率, allInfo:数据 }
      spriteConfig: {
        show: true,
        data: [
          {
            longitude: 121.560686,
            latitude: 31.292357,
            z: 0.181,
            value: 1000,
            title: "上海大学",
            texture: "locationTexture",
            scaleX: 0.17,
            scaleY: 0.17,
            allInfo: [
              { targetName: "项目地址", resultValue: "胡同口五二七路" },
              {
                targetName: "项目简介",
                resultValue: "主要学生床铺管理、环保设备(工程)、学生维修",
              },
              { targetName: "项目经理", resultValue: "方晓彤" },
              { targetName: "联系方式", resultValue: "16888888888" },
            ],
          },
          {
            longitude: 121.201939,
            latitude: 31.172799,
            z: 0.181,
            value: 1000,
            title: "浦西大学",
            texture: "locationTexture",
            scaleX: 0.17,
            scaleY: 0.17,
            allInfo: [
              { targetName: "项目地址", resultValue: "黄埔东路1993号" },
              {
                targetName: "项目简介",
                resultValue:
                  "主要负责学生强身健体、延年益寿，达到无坚不摧的效果。",
              },
              { targetName: "项目经理", resultValue: "令狐冲" },
              { targetName: "联系方式", resultValue: "193888888888" },
            ],
          },
        ],
      },
    },
    // 响应式尺寸配置
    sizeConfig: {
      type: "window", // window : 取全局, parent: 取父容器
      // id: "_Background_3D", // 父容器ID
    },
    // 后处理配置项(开启影响性能)
    passConfig: {
      type: "outline", // outline:高亮边,none:普通渲染,bloom:辉光
      outlineConfig: {
        edgeStrength: 3, //边缘强度
        edgeGlow: 1, //缓冲接近
        edgeThickness: 3, //边缘厚度
        pulsePeriod: 2, //脉冲周期
        gamma: true, // 伽马矫正
        antiAliasing: false, // 抗锯齿
        showIndex: 1, // 当前需要展示特效的地图，根据serise里的配置项变动
      },
      bloomConfig: {
        strength: 0.8, // 强度参数
        raduis: 0.5, // 半径参数
        threshold: 0.5, // 阈值参数
      },
    },
    // 渲染器配置项
    rendererConfig: {
      antialias: false, //开启锯齿 (影响性能)
      alpha: true, // 开启背景透明
      clearAlpha: 0, // 透明背景度
      clearColor: "", // 背景色
    },
    // 相机配置项
    camreaConfig: {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: {
        x: 0,
        y: 0,
        z: 1.86,
      },
      lookAt: true, // 指向原点
      controls: {
        show: true, // 开启控制器
        enableDamping: true, // 开启阻尼
        minPolarAngle: Math.PI * 0.25, // 最小极角为45度
        maxPolarAngle: Math.PI * 0.75, // 最大极角为135度
        minAzimuthAngle: -Math.PI * 0.25, // 最小方位角为-45度
        maxAzimuthAngle: Math.PI * 0.25, // 最大方位角为45度
        enablePan: false, // 平移
      },
    },
    // 灯光配置项
    lightConfig: [
      {
        type: "point", // 点光源
        color: 0x3e99e5, // 颜色
        intensity: 6, // 强度
        distance: 285,
        helper: false, // 助手
        position: {
          x: 4.5,
          y: 48,
          z: 50,
        },
      },
      {
        type: "point", // 点光源
        color: 0x3e99e5, // 颜色
        intensity: 12, // 强度
        distance: 151,
        helper: true, // 助手
        position: {
          x: 0,
          y: 0,
          z: 50,
        },
      },
      {
        type: "point", // 点光源
        color: 0x3e99e5, // 颜色
        intensity: 12, // 强度
        distance: 300,
        helper: true, // 助手
        position: {
          x: -10,
          y: 220,
          z: 50,
        },
      },
      // {
      //     type: 'ambient', // 环境光源
      //     color: 0xffffff, //颜色
      //     intensity: 1, // 强度
      //     position: {
      //         x: 0,
      //         y: 0,
      //         z: 0,
      //     },
      // },
    ],
    // 引入外部资源
    sources: [
      {
        name: "locationTexture",
        type: "texture",
        path: "texture/red-location.png",
      },
      {
        name: "bgTexture",
        type: "texture",
        path: "texture/bg.png",
      },
      {
        name: "tsangerYuYang",
        type: "font",
        path: "font/TsangerYuYangT_W03_Regular.json",
      },
    ],
  },
};
