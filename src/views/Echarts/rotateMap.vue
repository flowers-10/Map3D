<template>
  <!-- 旋转控制面板 -->
  <div class="rotation-controls">
    <div class="control-group">
      <label>旋转角度: {{ rotationAngle }}°</label>
      <input 
        type="range" 
        min="-360" 
        max="360" 
        v-model="rotationAngle" 
        @input="rotateMap(rotationAngle)"
        class="rotation-slider"
      />
    </div>
    <div class="control-buttons">
      <button @click="rotateMap(0)" class="btn-reset">重置</button>
      <button @click="rotateMap(-60)" class="btn-rotate">-60°</button>
      <button @click="rotateMap(90)" class="btn-rotate">90°</button>
      <button @click="rotateMap(180)" class="btn-rotate">180°</button>
      <button @click="rotateMap(270)" class="btn-rotate">270°</button>
      <button @click="startRotationAnimation" class="btn-animate">旋转动画</button>
    </div>
  </div>
  
  <div
    class="map"
    id="mapEchart"
    style="width: 100%; height: 100vh; background-color: #000"
  ></div>
</template>

<script setup>
// 引入工具
import geoJson from "@assets/JSON/GuangZhou.json"; //该文件路径改成自己项目中的文件路径即可
import * as echarts from "echarts";
// import "echarts-gl"; //3D地图插件
import { onMounted, ref } from "vue";
import { rotateGeoJSON, createRotationAnimation } from '@/utils/mapRotation.js'

const areaList = [
  {
    areaName: "西北分公司",
    area: ["新疆维吾尔自治区", "陕西省", "青海省"],
  },
  {
    areaName: "东北分公司",
    area: ["黑龙江省", "吉林省", "辽宁省"],
  },
  {
    areaName: "中南分公司",
    area: ["湖南省", "湖北省", "广东省"],
  },
  {
    areaName: "西南分公司",
    area: ["四川省", "贵州省", "云南省"],
  },
  {
    areaName: "华东分公司",
    area: ["上海市", "江苏省", "浙江省"],
  },
  {
    areaName: "华北分公司",
    area: ["北京市", "天津市", "河北省"],
  },
];

// 添加旋转功能
const rotationAngle = ref(0)
const originalGeoJson = ref(null)
const rotatedGeoJson = ref(null)
// 定义echarts方法
const chartMap = () => {
  var myChart = echarts.init(document.getElementById("mapEchart"));
  // geoJson.features = geoJson.features.filter((item) => {
  //   return ["湖南省", "湖北省", "广东省"].includes(item.properties.name);
  // });
  console.log(geoJson, 33333);

  echarts.registerMap("map", geoJson);
  // 防抖变量
  let debounceTimer = null;

  // 防抖函数
  const debounce = (func, delay) => {
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // 高亮处理函数
  const handleHighlight = (params) => {
    const series = myChart.getOption().series[1];
    // 先重置所有省份的样式
    series.data.forEach((item) => {
      delete item.itemStyle;
    });
    if (params.data) {
      // 找到鼠标悬停省份所属的分公司区域
      areaList.forEach((areaItem) => {
        if (areaItem.area.includes(params.name)) {
          // 高亮该分公司区域下的所有省份
          areaItem.area.forEach((provinceName) => {
            // 在 series.data 中找到对应的省份并设置高亮样式
            series.data.forEach((dataItem) => {
              if (provinceName === dataItem.name) {
                dataItem.itemStyle = {
                  shadowColor: "rgba(255, 230, 175,0.5)",
                  shadowBlur: 30,
                  areaColor: areaColors, // 使用对应分公司的颜色
                };
              }
            });
          });
        }
      });

      // 更新图表 - 修正版本，保留原有的 series[0]
      myChart.setOption(
        {
          series: [
            myChart.getOption().series[0], // 保留原有的 series[0]
            series, // 更新 series[1]
          ],
        },
        false
      );
    }
  };

  const handleDelete = () => {
    const series = myChart.getOption().series[1];
    series.data.forEach((item) => {
      item.itemStyle = {};
    });
    // 更新图表
    myChart.setOption(
      {
        series: [
          myChart.getOption().series[0], // 保留原有的 series[0]
          series, // 更新 series[1]
        ],
      },
      false
    );
  };

  // 创建防抖版本的高亮处理函数
  const debouncedHighlight = debounce(handleHighlight, 100); // 防抖延迟
  const debouncedDelete = debounce(handleDelete, 10); // 防抖延迟

  // 图表配置项
  let option = {
    dataset: [
      {
        dimensions: [
          "dimensionName",
          "targetName",
          "resultValue",
          "targetValue",
          "longitude",
          "latitude",
        ],
        source: [
          {
            index: 0,
            targetShowType: "main",
            targetId: "value2",
            targetName: "值类型2",
            targetSubName: null,
            targetValue: 14073,
            targetSubValue: null,
            dimenId: "name",
            dimensionName: "辽宁省",
            unit: "",
            subUnit: null,
            longitude: 123.45,
            latitude: 41.8,
            resultValue: "14073",
            resultSubValue: null,
            list: {
              targetName: "值类型2",
              targetValue: 14073,
              resultValue: "14073",
              unit: "",
            },
          },
          {
            index: 1,
            targetShowType: "main",
            targetId: "value2",
            targetName: "值类型2",
            targetSubName: null,
            targetValue: 14073,
            targetSubValue: null,
            dimenId: "name",
            dimensionName: "江西省",
            unit: "",
            subUnit: null,
            longitude: 115.89,
            latitude: 27.65,
            resultValue: "14073",
            resultSubValue: null,
            list: {
              targetName: "值类型2",
              targetValue: 14073,
              resultValue: "14073",
              unit: "",
            },
          },
          {
            index: 2,
            targetShowType: "main",
            targetId: "value2",
            targetName: "值类型2",
            targetSubName: null,
            targetValue: 14075,
            targetSubValue: null,
            dimenId: "name",
            dimensionName: "湖南省",
            unit: "",
            subUnit: null,
            longitude: 112.98,
            latitude: 28.12,
            resultValue: "14075",
            resultSubValue: null,
            list: {
              targetName: "值类型2",
              targetValue: 14075,
              resultValue: "14075",
              unit: "",
            },
          },
          {
            index: 3,
            targetShowType: "main",
            targetId: "value2",
            targetName: "值类型2",
            targetSubName: null,
            targetValue: 14073,
            targetSubValue: null,
            dimenId: "name",
            dimensionName: "海南省",
            unit: "",
            subUnit: null,
            longitude: 110.35,
            latitude: 19.2,
            resultValue: "14073",
            resultSubValue: null,
            list: {
              targetName: "值类型2",
              targetValue: 14073,
              resultValue: "14073",
              unit: "",
            },
          },
          {
            index: 4,
            targetShowType: "main",
            targetId: "value2",
            targetName: "值类型2",
            targetSubName: null,
            targetValue: 14073,
            targetSubValue: null,
            dimenId: "name",
            dimensionName: "湖北省",
            unit: "",
            subUnit: null,
            longitude: 114.31,
            latitude: 30.6,
            resultValue: "14073",
            resultSubValue: null,
            list: {
              targetName: "值类型2",
              targetValue: 14073,
              resultValue: "14073",
              unit: "",
            },
          },
          {
            index: 5,
            targetShowType: "main",
            targetId: "value2",
            targetName: "值类型2",
            targetSubName: null,
            targetValue: 14073,
            targetSubValue: null,
            dimenId: "name",
            dimensionName: "广东省",
            unit: "",
            subUnit: null,
            longitude: 113.26,
            latitude: 23.12,
            resultValue: "14073",
            resultSubValue: null,
            list: {
              targetName: "值类型2",
              targetValue: 14073,
              resultValue: "14073",
              unit: "",
            },
          },
          {
            index: 6,
            targetShowType: "main",
            targetId: "value2",
            targetName: "值类型2",
            targetSubName: null,
            targetValue: 14073,
            targetSubValue: null,
            dimenId: "name",
            dimensionName: "河北省",
            unit: "",
            subUnit: null,
            longitude: 114.52,
            latitude: 38.05,
            resultValue: "14073",
            resultSubValue: null,
            list: {
              targetName: "值类型2",
              targetValue: 14073,
              resultValue: "14073",
              unit: "",
            },
          },
        ],
      },
    ],
    color: [
      "#5B8FF9",
      "#61DDAA",
      "#65789B",
      "#F6BD16",
      "#7262fd",
      "#78D3F8",
      "#9661BC",
      "#F6903D",
      "#008685",
    ],
    tooltip: {
      show: true,
      trigger: "item",
    },
    legend: {
      show: false,
      orient: "horizontal",
      bottom: 5,
    },
    geo: [
      {
        map: "map",
        zlevel: -1,
        zoom: 0.8,
        silent: true,
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
        roam: false,
        itemStyle: {
          normal: {
            borderColor: "rgba(18, 239, 213,0.8)",
            borderWidth: 3,
            shadowColor: "rgba(18, 239, 213,0.8)",
            shadowOffsetY: 0,
            // shadowBlur: 10,
          },
        },
        label: {
          normal: {
            show: false,
          },
          emphasis: {
            show: false,
          },
        },
      },
      {
        type: "map",
        map: "map",
        zlevel: -2,
        zoom: 0.8,
        layoutCenter: ["50%", "51.4%"],
        layoutSize: "100%",
        roam: false,
        silent: true,
        itemStyle: {
          normal: {
            borderColor: "rgba(35, 161, 184,0.5)",
            shadowColor: "rgba(35, 161, 184,0.8)",
            shadowOffsetY: 5,
            shadowBlur: 15,
            areaColor: "rgba(83, 226, 235, 0.25)",
          },
        },
      },
      {
        type: "map",
        map: "map",
        zlevel: -3,
        zoom: 0.8,
        layoutCenter: ["50%", "52.4%"],
        layoutSize: "100%",
        roam: false,
        silent: true,
        itemStyle: {
          normal: {
            borderColor: "rgba(7, 65, 117,0.5)",
            shadowColor: "rgba(7, 65, 117,0.8)",
            shadowOffsetY: 15,
            shadowBlur: 8,
            areaColor: "rgba(83, 226, 235, 0.48)",
          },
        },
      },
    ],

    series: [
      {
        name: "涟漪",
        type: "effectScatter",
        coordinateSystem: "geo",
        colorBy: "data",
        zlevel: 4,
        rippleEffect: {
          period: 2,
          brushType: "fill",
          scale: 3.5,
        },
        tooltip: {
          show: true,
          position: "top",
          formatter(params, ticket, callback) {
            const header = `<h4 style="font-weight: 500;font-size: 16px;color: #D7F8FF;padding-bottom:8px;margin:0 14px 8px 10px;box-sizing:border-box;border-bottom:1px solid #68C0CF
            ">${params.name}</h4>`;
            const listDom = params.value[2]
              .map((i) =>
                i.targetName
                  ? `<div style="font-weight: 500;font-size: 12px;color: #D7F8FF;box-sizing:border-box;width: 100%;display: flex;justify-content: space-between;padding:0 12px;">
                                        <span style='margin-right:11px'>${
                                          i.targetName
                                        }：</span>
                                        <div ><span style=''>${
                                          i.resultValue
                                        }</span><span style=''>${
                      i.unit || ""
                    }</span></div>
                                    </div>`
                  : ""
              )
              .join("");
            return header + listDom;
          },
          borderColor: "rgba(0, 0, 0, 0)",
          extraCssText: `background:url(./tooltip-bg.png) no-repeat center center ;width: 218px;height: 115px;background-size:100% 100%;`,
        },
        label: {
          show: false,
          position: "right",
          formatter: "{b}",
          color: "#333",
          fontSize: 12,
        },
        symbol:
          "image://http://new-see.oicp.io:25280/v10/resource/baseStatic/image/small-yellow-location.png",
        data: [
          {
            name: "辽宁省",
            value: [
              123.45,
              41.8,
              [
                {
                  targetName: "值类型2",
                  targetValue: 14073,
                  resultValue: "14073",
                  unit: "",
                },
              ],
            ],
          },
          {
            name: "江西省",
            value: [
              115.89,
              27.65,
              [
                {
                  targetName: "值类型2",
                  targetValue: 14073,
                  resultValue: "14073",
                  unit: "",
                },
              ],
            ],
          },
          {
            name: "湖南省",
            value: [
              112.98,
              28.12,
              [
                {
                  targetName: "值类型2",
                  targetValue: 14075,
                  resultValue: "14075",
                  unit: "",
                },
              ],
            ],
          },
          {
            name: "海南省",
            value: [
              110.35,
              19.2,
              [
                {
                  targetName: "值类型2",
                  targetValue: 14073,
                  resultValue: "14073",
                  unit: "",
                },
              ],
            ],
          },
          {
            name: "湖北省",
            value: [
              114.31,
              30.6,
              [
                {
                  targetName: "值类型2",
                  targetValue: 14073,
                  resultValue: "14073",
                  unit: "",
                },
              ],
            ],
          },
          {
            name: "广东省",
            value: [
              113.26,
              23.12,
              [
                {
                  targetName: "值类型2",
                  targetValue: 14073,
                  resultValue: "14073",
                  unit: "",
                },
              ],
            ],
          },
          {
            name: "河北省",
            value: [
              114.52,
              38.05,
              [
                {
                  targetName: "值类型2",
                  targetValue: 14073,
                  resultValue: "14073",
                  unit: "",
                },
              ],
            ],
          },
        ],
      },
      {
        type: "map",
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
        select: {
          disabled: true,
        },
        tooltip: {
          show: false,
        },
        label: {
          normal: {
            show: true,
            color: "#fff",
          },
          emphasis: {
            show: false,
            color: "#333",
          },
        },
        emphasis: {
          disabled: true,
        },
        zoom: 0.8,
        map: "map",
        data: [
          {
            value: {
              adcode: 110000,
              name: "北京市",
              center: [116.405285, 39.904989],
              centroid: [116.41995, 40.18994],
              childrenNum: 16,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 0,
              acroutes: [100000],
            },
            name: "北京市",
          },
          {
            value: {
              adcode: 120000,
              name: "天津市",
              center: [117.190182, 39.125596],
              centroid: [117.347043, 39.288036],
              childrenNum: 16,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 1,
              acroutes: [100000],
            },
            name: "天津市",
          },
          {
            value: {
              adcode: 130000,
              name: "河北省",
              center: [114.502461, 38.045474],
              childrenNum: 11,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 2,
              acroutes: [100000],
            },
            name: "河北省",
          },
          {
            value: {
              adcode: 140000,
              name: "山西省",
              center: [112.549248, 37.857014],
              centroid: [112.304436, 37.618179],
              childrenNum: 11,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 3,
              acroutes: [100000],
            },
            name: "山西省",
          },
          {
            value: {
              adcode: 150000,
              name: "内蒙古自治区",
              center: [111.670801, 40.818311],
              centroid: [114.077429, 44.331087],
              childrenNum: 12,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 4,
              acroutes: [100000],
            },
            name: "内蒙古自治区",
          },
          {
            value: {
              adcode: 210000,
              name: "辽宁省",
              center: [123.429096, 41.796767],
              centroid: [122.604994, 41.299712],
              childrenNum: 14,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 5,
              acroutes: [100000],
            },
            name: "辽宁省",
          },
          {
            value: {
              adcode: 220000,
              name: "吉林省",
              center: [125.3245, 43.886841],
              centroid: [126.171208, 43.703954],
              childrenNum: 9,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 6,
              acroutes: [100000],
            },
            name: "吉林省",
          },
          {
            value: {
              adcode: 230000,
              name: "黑龙江省",
              center: [126.642464, 45.756967],
              centroid: [127.693027, 48.040465],
              childrenNum: 13,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 7,
              acroutes: [100000],
            },
            name: "黑龙江省",
          },
          {
            value: {
              adcode: 310000,
              name: "上海市",
              center: [121.472644, 31.231706],
              centroid: [121.438737, 31.072559],
              childrenNum: 16,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 8,
              acroutes: [100000],
            },
            name: "上海市",
          },
          {
            value: {
              adcode: 320000,
              name: "江苏省",
              center: [118.767413, 32.041544],
              centroid: [119.486506, 32.983991],
              childrenNum: 13,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 9,
              acroutes: [100000],
            },
            name: "江苏省",
          },
          {
            value: {
              adcode: 330000,
              name: "浙江省",
              center: [120.153576, 30.287459],
              centroid: [120.109913, 29.181466],
              childrenNum: 11,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 10,
              acroutes: [100000],
            },
            name: "浙江省",
          },
          {
            value: {
              adcode: 340000,
              name: "安徽省",
              center: [117.283042, 31.86119],
              centroid: [117.226884, 31.849254],
              childrenNum: 16,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 11,
              acroutes: [100000],
            },
            name: "安徽省",
          },
          {
            value: {
              adcode: 350000,
              name: "福建省",
              center: [119.306239, 26.075302],
              centroid: [118.006468, 26.069925],
              childrenNum: 9,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 12,
              acroutes: [100000],
            },
            name: "福建省",
          },
          {
            value: {
              adcode: 360000,
              name: "江西省",
              center: [115.892151, 28.676493],
              centroid: [115.732975, 27.636112],
              childrenNum: 11,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 13,
              acroutes: [100000],
            },
            name: "江西省",
          },
          {
            value: {
              adcode: 370000,
              name: "山东省",
              center: [117.000923, 36.675807],
              centroid: [118.187759, 36.376092],
              childrenNum: 16,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 14,
              acroutes: [100000],
            },
            name: "山东省",
          },
          {
            value: {
              adcode: 410000,
              name: "河南省",
              center: [113.665412, 34.757975],
              centroid: [113.619717, 33.902648],
              childrenNum: 18,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 15,
              acroutes: [100000],
            },
            name: "河南省",
          },
          {
            value: {
              adcode: 420000,
              name: "湖北省",
              center: [114.298572, 30.584355],
              centroid: [112.271301, 30.987527],
              childrenNum: 17,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 16,
              acroutes: [100000],
            },
            name: "湖北省",
          },
          {
            value: {
              adcode: 430000,
              name: "湖南省",
              center: [112.982279, 28.19409],
              centroid: [111.711649, 27.629216],
              childrenNum: 14,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 17,
              acroutes: [100000],
            },
            name: "湖南省",
          },
          {
            value: {
              adcode: 440000,
              name: "广东省",
              center: [113.280637, 23.125178],
              centroid: [113.429919, 23.334643],
              childrenNum: 21,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 18,
              acroutes: [100000],
            },
            name: "广东省",
          },
          {
            value: {
              adcode: 450000,
              name: "广西壮族自治区",
              center: [108.320004, 22.82402],
              centroid: [108.7944, 23.833381],
              childrenNum: 14,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 19,
              acroutes: [100000],
            },
            name: "广西壮族自治区",
          },
          {
            value: {
              adcode: 460000,
              name: "海南省",
              center: [110.33119, 20.031971],
              centroid: [109.754859, 19.189767],
              childrenNum: 19,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 20,
              acroutes: [100000],
            },
            name: "海南省",
          },
          {
            value: {
              adcode: 500000,
              name: "重庆市",
              center: [106.504962, 29.533155],
              centroid: [107.8839, 30.067297],
              childrenNum: 38,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 21,
              acroutes: [100000],
            },
            name: "重庆市",
          },
          {
            value: {
              adcode: 510000,
              name: "四川省",
              center: [104.065735, 30.659462],
              centroid: [102.693453, 30.674545],
              childrenNum: 21,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 22,
              acroutes: [100000],
            },
            name: "四川省",
          },
          {
            value: {
              adcode: 520000,
              name: "贵州省",
              center: [106.713478, 26.578343],
              centroid: [106.880455, 26.826368],
              childrenNum: 9,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 23,
              acroutes: [100000],
            },
            name: "贵州省",
          },
          {
            value: {
              adcode: 530000,
              name: "云南省",
              center: [102.712251, 25.040609],
              centroid: [101.485106, 25.008643],
              childrenNum: 16,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 24,
              acroutes: [100000],
            },
            name: "云南省",
          },
          {
            value: {
              adcode: 540000,
              name: "西藏自治区",
              center: [91.132212, 29.660361],
              centroid: [88.388277, 31.56375],
              childrenNum: 7,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 25,
              acroutes: [100000],
            },
            name: "西藏自治区",
          },
          {
            value: {
              adcode: 610000,
              name: "陕西省",
              center: [108.948024, 34.263161],
              centroid: [108.887114, 35.263661],
              childrenNum: 10,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 26,
              acroutes: [100000],
            },
            name: "陕西省",
          },
          {
            value: {
              adcode: 620000,
              name: "甘肃省",
              center: [103.823557, 36.058039],
              childrenNum: 14,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 27,
              acroutes: [100000],
            },
            name: "甘肃省",
          },
          {
            value: {
              adcode: 630000,
              name: "青海省",
              center: [101.778916, 36.623178],
              centroid: [96.043533, 35.726403],
              childrenNum: 8,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 28,
              acroutes: [100000],
            },
            name: "青海省",
          },
          {
            value: {
              adcode: 640000,
              name: "宁夏回族自治区",
              center: [106.278179, 38.46637],
              centroid: [106.169866, 37.291332],
              childrenNum: 5,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 29,
              acroutes: [100000],
            },
            name: "宁夏回族自治区",
          },
          {
            value: {
              adcode: 650000,
              name: "新疆维吾尔自治区",
              center: [87.617733, 43.792818],
              centroid: [85.294711, 41.371801],
              childrenNum: 24,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 30,
              acroutes: [100000],
            },
            name: "新疆维吾尔自治区",
          },
          {
            value: {
              adcode: 710000,
              name: "台湾省",
              center: [121.509062, 25.044332],
              centroid: [120.971485, 23.749452],
              childrenNum: 0,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 31,
              acroutes: [100000],
            },
            name: "台湾省",
          },
          {
            value: {
              adcode: 810000,
              name: "香港特别行政区",
              center: [114.173355, 22.320048],
              centroid: [114.134357, 22.377366],
              childrenNum: 18,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 32,
              acroutes: [100000],
            },
            name: "香港特别行政区",
          },
          {
            value: {
              adcode: 820000,
              name: "澳门特别行政区",
              center: [113.54909, 22.198951],
              centroid: [113.566988, 22.159307],
              childrenNum: 8,
              level: "province",
              parent: {
                adcode: 100000,
              },
              subFeatureIndex: 33,
              acroutes: [100000],
            },
            name: "澳门特别行政区",
          },
        ],
        itemStyle: {
          normal: {
            label: {
              show: false,
              color: "#333",
            },
            color: "#333",
            borderColor: "#fff",
            borderWidth: 1.5,
            areaColor: {
              image: "./image.png",
              repeat: "no-repeat",
            },
          },
          emphasis: {
            show: false,
          },
        },
      },
    ],
  };

  // 定义颜色映射，为每个分公司区域设置不同颜色
  const areaColors = {
    colorStops: [
      {
        offset: 0,
        color: "#11A3D0",
      },
      {
        offset: 1,
        color: "#17E1FA",
      },
    ],
    x: 0.5,
    y: 0.5,
    r: 0.5,
    type: "radial",
    global: false,
  };

  // myChart.on("mousemove", (params) => {
  //   debouncedHighlight(params);
  // });
  // myChart.on("mouseout", () => {
  //   debouncedDelete();
  // });

  myChart.setOption(option);
  //让可视化地图跟随浏览器大小缩放
  window.addEventListener("resize", () => {
    charts.resize();
  });
};

// 旋转地图的方法
const rotateMap = (angle) => {
  if (!originalGeoJson.value) return
  
  rotationAngle.value = angle
  rotatedGeoJson.value = rotateGeoJSON(originalGeoJson.value, angle)
  console.log(rotatedGeoJson.value,333333);
  
  // 重新注册地图数据并更新图表
  echarts.registerMap('map', rotatedGeoJson.value)
  
  // 重新渲染图表
  const myChart = echarts.getInstanceByDom(document.getElementById('mapEchart'))
  if (myChart) {
    myChart.setOption({
      geo: {
        map: 'map'
      }
    })
  }
}

// 创建旋转动画
const startRotationAnimation = () => {
  const frames = createRotationAnimation(originalGeoJson.value, 360, 60)
  let currentFrame = 0
  
  const animate = () => {
    if (currentFrame < frames.length) {
      echarts.registerMap('map', frames[currentFrame])
      
      const myChart = echarts.getInstanceByDom(document.getElementById('mapEchart'))
      if (myChart) {
        myChart.setOption({
          geo: {
            map: 'map'
          }
        })
      }
      
      currentFrame++
      setTimeout(animate, 50) // 50ms间隔，约20fps
    }
  }
  
  animate()
}

// 保存原始数据
onMounted(() => {
  originalGeoJson.value = JSON.parse(JSON.stringify(geoJson))
  rotatedGeoJson.value = geoJson
  chartMap()
});
</script>

<style scoped>
.rotation-controls {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 8px;
  color: white;
  z-index: 100;
  min-width: 300px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.rotation-slider {
  width: 100%;
  height: 6px;
  background: #333;
  border-radius: 3px;
  outline: none;
}

.rotation-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.control-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-reset,
.btn-rotate,
.btn-animate {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.btn-reset {
  background: #f44336;
  color: white;
}

.btn-rotate {
  background: #2196f3;
  color: white;
}

.btn-animate {
  background: #4caf50;
  color: white;
}

.btn-reset:hover,
.btn-rotate:hover,
.btn-animate:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}
</style>
