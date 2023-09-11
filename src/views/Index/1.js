const chinaName = "china";

LoadMap(chinaName, chinaData, myChart);

// 配置二维地图贴图
 LoadMapping(name, data) {
  var chartOption = {
    geo: {
      show: true,
      map: name,
      top: "0",
      width: 1024,
      label: {
        position: "top",
        distance: 5,
        normal: {
          show: true,
          textStyle: {
            color: "#fff",
          },
        },
        emphasis: {
          textStyle: {
            color: "#fff",
          },
        },
      },
      itemStyle: {
        normal: {
          areaColor: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: "#09132c", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#274d68", // 100% 处的颜色
              },
            ],
          },
        },
      },
      emphasis: {
        label: {
          show: true,
          textStyle: {
            color: "#fff",
            fontSize: 13,
            backgroundColor: "rgba(0,23,11,1)",
          },
        },
        itemStyle: {
          areaColor: "#f00", // 高亮时地图板块颜色改变
        },
      },
    },

    series: [
      {
        type: `effectScatter`,
        coordinateSystem: `geo`,
        showEffectOn: "render",
        zlevel: 1,
        rippleEffect: {
          period: 5,
          scale: 4,
          brushType: "fill",
        },

        hoverAnimation: true,
        label: {
          normal: {
            formatter: "{b}",
            position: "bottom",
            offset: [15, 0],
            color: "#fff",
            show: true,
            fontSize: 16,
          },
        },
        itemStyle: {
          normal: {
            color: "#1DE9B6",
            // color: function (value) { //随机颜色
            //     return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
            // },
            shadowBlur: 10,
            shadowColor: "#333",
          },
        },
        symbolSize: 16,
        data: data,
      },
    ],
  };

  return chartOption;
}

 LoadMap(name, data, myChart) {
  // 先渲染贴图
  const canvas = document.createElement(`canvas`);
  var mapBg = echarts.init(canvas, null, {
    width: 1024,
    height: 1024,
  });
  const chartOption = LoadMapping(name, data);
  mapBg.setOption(chartOption);
  // 3D地图渲染
  option = {
    backgroundColor: "rgb(0,0,0,0)",
    visualMap: [
      {
        type: "continuous",
        seriesIndex: 0,
        text: ["bar3D"],
        calculable: true,
        min: 1000,
        max: 5000,
        inRange: {
          color: [
            "#4ab2e5",
            "#5abead",
            "#f56321",
            "#f58f0e",
            "#d5b314",
            "#b9be23",
          ],
        },
      },
    ],
    geo3D: {
      map: name,
      roam: true,
      shading: `color`,
      width: 1024,
      boxHeight: 20,
      itemStyle: {
        color: "#5a8dce",
        opacity: 1,
        borderWidth: 1,
        borderColor: "#96ebf7",
      },
      emphasis: {
        //当鼠标放上去  地区区域是否显示名称
        label: {
          show: true,
          textStyle: {
            color: "#fff",
            fontSize: 13,
            backgroundColor: "rgba(0,23,11,1)",
          },
        },
        itemStyle: {
          areaColor: "#498fde", // 高亮时地图板块颜色改变
        },
      },
      colorMaterial: {
        detailTexture: mapBg, // 纹理贴图
        textureTiling: 1, // 纹理平铺，1是拉伸，数字表示纹理平铺次数
      },
      environment: new echarts.graphic.LinearGradient(
        0,
        0,
        0,
        1,
        [
          {
            offset: 0,
            color: "#176186", // 天空颜色
          },
          {
            offset: 0.5,
            color: "#176186", // 地面颜色
          },
          {
            offset: 1,
            color: "#07101b", // 地面颜色
          },
        ],
        false
      ),
      viewControl: {
        projection: "perspective",
        autoRotate: true, //会有自动旋转查看动画出现,可查看每个维度信息
        autoRotateDirection: "ccw", //物体自传的方向。默认是 'cw' 也就是从上往下看是顺时针方向，也可以取 'ccw'，既从上往下看为逆时针方向。
        autoRotateSpeed: 2, //物体自传的速度
        autoRotateAfterStill: 1, //在鼠标间静止操作后恢复自动旋转的时间隔。在开启 autoRotate 后有效。
        // distance:90,//默认视角距离主体的距离(常用)
        // alpha:90,//视角绕 x 轴，即上下旋转的角度(与beta一起控制视野成像效果)
        beta: 90, //视角绕 y 轴，即左右旋转的角度。
        // center:[]//视角中心点，旋转也会围绕这个中心点旋转，默认为[0,0,0]。
        // zlevel://组件所在的层。
        minAlpha: -360000,
        maxAlpha: 360000,
        minBeta: -360000,
        maxBeta: 360000,
        animation: true,
        animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
        animationEasingUpdate: "cubicInOut",
      },
      light: {
        main: {
          intensity: 1,
        },
        ambient: {
          intensity: 1,
          quality: "high",
        },
        ambientCubemap: {
          exposure: 1.0,
          diffuseIntensity: 2,
          specularIntensity: 2,
        },
      },
    },
    series: [
      {
        type: "bar3D",
        coordinateSystem: "geo3D",
        barSize: 1.2,
        bevelSize: 1,
        bevelSmoothness: 10,
        minHeight: 1,
        // shading: 'color',
        // shading: 'lambert',
        shading: "realistic",
        silent: false, //图形是否不响应和触发鼠标事件
        opacity: 0.6,
        itemStyle: {
          opacity: 0.6,
        },
        label: {
          show: false,
          formatter: function (data) {
            var res = "订单量：" + data.name + " " + data.value[2];
            return res;
          },
        },
        data: data,
      },
    ],
  };
  myChart.setOption(option, true);
}
