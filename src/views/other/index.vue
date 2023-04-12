<template>
  <div class="map">
    <div class="map-container">
      <div class="map-container-title">xxx标题</div>
      <div class="map-chart" id="mapEchart"></div>
    </div>
  </div>
</template>

<script>
import geoJson from "./zhejiang.json";
export default {
  created() {},
  methods: {
    getData() {
      // 你去处理这两个data就行了，通过遍历，这个旧数组里保存的是小图标的坐标
      let oldData3D = [
        { name: "温州", value: [120.705869, 28.001095] },
        { name: "湖州", value: [120.094566, 30.899015] },
        { name: "嘉兴", value: [120.762045, 30.750912] },
        { name: "绍兴", value: [120.586673, 30.036519] },
        { name: "丽水", value: [119.929503, 28.472979] },
        { name: "衢州", value: [118.880768, 28.941661] },
        { name: "金华", value: [119.654027, 29.084455] },
        { name: "台州", value: [121.426996, 28.662297] },
        { name: "宁波", value: [121.556686, 29.880177] },
        { name: "舟山", value: [122.214339, 29.991092] }
      ];
      // 这里放大图标的坐标
      let newData3D = [{ name: "杭州", value: [119.001693, 30.280059] }];
      // 大图标只有一条，就是动画放大的内容
      // 自己写一个轮询去替换并且返回oldData3D,newData3D即可
      return { oldData3D, newData3D };
    },
    getOption(oldData3D, newData3D) {
      return {
        geo3D: {
          map: "zhejiang",
          roam: true,
          itemStyle: {
            color: "#007aff",
            opacity: 0.8,
            borderWidth: 0.4,
            borderColor: "#000"
            // areaColor: '#fff'
          },
          viewControl: {
            autoRotate: false,
            autoRotateAfterStill: 3,
            distance: 120,
            minAlpha: 5, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
            maxAlpha: 90, // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
            minBeta: -360, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
            maxBeta: 360, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
            animation: false, // 是否开启动画。[ default: true ]
            animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
            animationEasingUpdate: "cubicInOut" // 过渡动画的缓动效果。[ default: cubicInOut ]
          },

          emphasis: {
            disabled: true, //是否可以被选中
            label: {
              //移入时的高亮文本
              show: true,
              color: "#333", //显示字体颜色变淡
              fontSize: 18 //显示字体变大
            },
            itemStyle: {
              color: "#ff7aff" //显示移入的区块变粉色
            }
          },
          label: {
            show: true,
            position: "top",
            color: "#111", //地图初始化区域字体颜色
            fontSize: 14,
            lineHeight: 16
            // textStyle: {
            //   color: "#fff", //地图初始化区域字体颜色
            //   fontSize: 12,
            //   opacity: 1,
            //   backgroundColor: "rgba(0,23,11,0)",
            // },
          },
          shading: "lambert",
          light: {
            //光照阴影
            main: {
              // color: "#fff", //光照颜色
              intensity: 1, //光照强度
              //shadowQuality: 'high', //阴影亮度
              shadow: true, //是否显示阴影
              shadowQuality: "medium", //阴影质量 ultra //阴影亮度
              alpha: 55,
              beta: 10
            },
            ambient: {
              intensity: 0.7
            }
          }
        },
        series: [
          //3D散点图配置项
          {
            type: "scatter3D",
            coordinateSystem: "geo3D",
            opacity: 1,
            symbol: "circle",
            //自定义的data数组 value中数组的含义:[杭州的经度or纬度]
            data: oldData3D,
            itemStyle: {
              //隐藏原点
              color: "transparent"
            },
            label: {
              show: true,
              formatter(data) {
                return "2";
              },
              // backgroundColor: {
              //   image:require('./icon.png'),
              //   padding: [15, 20],
              // },
              textStyle: {
                color: "transparent",
                padding: [15, 20],
                backgroundColor: {
                  image: require("./icon.png")
                }
              }
            }
          },
          {
            type: "scatter3D",
            coordinateSystem: "geo3D",
            opacity: 1,
            symbol: "circle",
            symbolSize: 30,
            //自定义的data数组 value中数组的含义:[杭州的经度or纬度]
            data: newData3D,
            itemStyle: {
              //隐藏原点
              color: "transparent"
            },
            label: {
              show: true,
              formatter(data) {
                return "2";
              },
              // backgroundColor: {
              //   image:require('./icon.png'),
              //   padding: [15, 20],
              // },
              textStyle: {
                color: "transparent",
                padding: [40, 40],
                backgroundColor: {
                  image: require("./icon.png")
                }
              }
            }
          }
        ]
      };
    },
    chartMap() {
      var myChart = this.$echarts.init(document.getElementById("mapEchart"));
      this.$echarts.registerMap("zhejiang", geoJson);
      let data = this.getData()
      // 图表配置项
      let option = this.getOption(data.oldData3D,data.newData3D);
      myChart.setOption(option);
    }
  },
  mounted() {
    this.chartMap();
  }
};
</script>

<style lang="less" scoped>
.map {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  .map-container {
    width: 100%;
    height: 100%;
    background: #fff;
    position: relative;
    .map-container-title {
      margin: 56px 0 16px;
      font-size: 24px;
      font-weight: 700;
      color: #333;
      line-height: 30px;
      display: flex;
      justify-content: center;
    }

    .map-chart {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
