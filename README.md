# 需求分析

![1.gif](https://img-blog.csdnimg.cn/img_convert/2599cdfdc5e9581f8ba7ccdd98cd0be5.gif#averageHue=#070d31&clientId=uf414d4de-1063-4&from=drop&id=u3f1b064f&name=1.gif&originHeight=364&originWidth=736&originalType=binary&ratio=1&rotation=0&showTitle=false&size=2936583&status=done&style=none&taskId=u9229c651-76a1-4881-93f3-a957a761331&title=#averageHue=#070d31&from=url&id=U3WaH&originHeight=364&originWidth=736&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

地图下钻是一个非常常见的功能需求，本篇文章会细致讲解如何在Vue3中使用Eharts-gl渲染出3D地图，并且实现地图下钻和返回上级地图的完整功能。

> 注意此项目为vue3版本，vue2版本在仓库分支里
> 给个星星吧！！不定期更新此demo，一般只更新vue3的版本，2版本自行迁移即可。


demo依赖版本确认：

```json
"axios": "^1.3.5",
"echarts": "^5.2.2",
"echarts-gl": "^2.0.9",
"vue": "^3.2.47"
```

我把需求拆分成两个主要功能模块：**初始化地图**和**更新地图**功能构思：

1. **初始化地图**

- 初始化DOM节点
- `initmap`初始化地图 -> `getMapJSON` 获取地图JSON并且初始化地图配置项data数据 -> `getOption`获得地图总配置项 -> `updateMap`更新配置项
- 监听点击事件（地图下钻）

2. **更新地图**

- `updateMap`
- 点击区域下钻省市区地图
- `backMap`返回上级地图
# 需求实现

### 功能介绍

**点击区域**：初始化地图 => 给地图添加点击事件 => 拿到用户点击的区域名称 => 保存用户点击的区域做历史记录 => 请求接口获取到该区域的JSON数据 => 重新渲染
**点击返回图标**： 遍历历史记录 => 弹出当前历史记录的地图信息 => 找到要返回上一级的地图信息 => 重新渲染地图

### 程序运行流程图

![](https://img-blog.csdnimg.cn/img_convert/846abfb1c733e58d96e4587627f51d3e.jpeg)

> 关于使用用户内存保存历史记录，还是请求接口保存的问题：
> 接口性能还是比较高的，存在内存数据及时性就不太准确

![image.png](https://img-blog.csdnimg.cn/img_convert/3f340b6d08da1e581b6b4fbe767cb97e.png#averageHue=#afcef0&clientId=u1d61fff3-5eb2-4&from=paste&height=68&id=u71bebd2d&name=image.png&originHeight=68&originWidth=854&originalType=binary&ratio=1&rotation=0&showTitle=false&size=12741&status=done&style=none&taskId=ua548abb0-34a9-4f07-b37f-afc428e6f5e&title=&width=854#averageHue=#afcef0&from=url&id=iwcIO&originHeight=68&originWidth=854&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![image.png](https://img-blog.csdnimg.cn/img_convert/1047f1c34ca1ae515d9fad82e79d0c69.png#averageHue=#f6f6f7&clientId=u1d61fff3-5eb2-4&from=paste&height=136&id=u6cc3010e&name=image.png&originHeight=136&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15476&status=done&style=none&taskId=u056c6865-79a0-48e8-a775-98e1233f1af&title=&width=866#averageHue=#f6f6f7&from=url&id=BoWgF&originHeight=136&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 总体功能

1.地图下钻和返回上级功能

### 总体代码
vue3 版本
```js
<template>
  <div class="investment-screen">
    <svg
      style="position: absolute; left: 20px; top: 20px; cursor: pointer"
      @click="backMap"
      t="1681180771137"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3427"
      width="200"
      height="200"
    >
      <path
        d="M426.666667 384V213.333333l-298.666667 298.666667 298.666667 298.666667v-174.933334c213.333333 0 362.666667 68.266667 469.333333 217.6-42.666667-213.333333-170.666667-426.666667-469.333333-469.333333z"
        p-id="3428"
        fill="#ffffff"
      ></path>
    </svg>
    <div class="map-chart" id="mapEchart"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件
import { onMounted, ref } from "vue";
import axios from "axios";

/**
 * 初始化地图
 */

// 定义echarts方法
const chartMap = async () => {
  // 初始化dom
  const myChart = echarts.init(
    <HTMLElement>document.getElementById("mapEchart")
  );
  // 初始化map
  initMap(myChart, "map", "100000");
  // 添加点击事件
  myChart.on("click", (e: any) => {
    console.log(e);
    const newName: string = e.name;
    if (e.value.level === "district") return alert("该地区已经无法下钻");
    // 添加历史记录
    historyMapData.value.push(e.value);
    // 初始化地图
    initMap(myChart, newName, e.value.adcode);
  });
  //让可视化地图跟随浏览器大小缩放
  window.addEventListener("resize", () => {
    myChart.resize();
  });
};
// 初始化图表
const initMap = async (
  chartDOM: echarts.ECharts,
  geoName: string,
  adcode: string
) => {
  // 清除echarts实例
  chartDOM.clear();
  // 请求map的json
  const mapData = await getMapJSON(adcode, geoName);
  // 图表配置项
  const option = getOption(geoName, mapData);
  // 渲染配置
  chartDOM.setOption(option);
};

/**
 * 地图配置项
 */

// 请求地图json数据，并过滤成地图data配置项
const getMapJSON = async (adcode: string = "100000", geoName: string) => {
  const res = await axios.get(
    `https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`
  );

  // 重新注册地图
  echarts.registerMap(geoName, <any>res.data);
  // 过滤json数据

  const mapData = res.data.features.map((item: any) => {
    return {
      value: item.properties,
      name: item.properties.name,
    };
  });

  return mapData;
};
// 图表生成配置项
const getOption = (geoName: string, mapData: any) => {
  // 图表配置项
  const option = {
    geo3D: {
      zlevel: -100,
      show: true,
      map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
      regionHeight: 2,
      shading: "realistic",
      realisticMaterial: {
        detailTexture: "./1.png",
      },
      itemStyle: {
        borderWidth: 1.5,
        borderColor: "#5FB9DA",
        color: "#6597D0",
        opacity: 1,
      },
      label: {
        show: true, // 是否显示标签。
        textStyle: {
          color: "#fff", // 地图初始化区域字体颜色
          fontSize: 40,
        },
        formatter: (e: any) => {
          return ` ${e.name} `;
        },
      },
    },
    series: [
      {
        zlevel: -10,
        regionHeight: 2,
        type: "map3D",
        map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
        data: mapData, //这里比较重要：获得过滤后的data，这样点击事件时就能获得这个data的值
        emphasis: {
          label: { show: false },
          itemStyle: {
            color: "transparent",
          },
        },
        shading: "realistic",
        realisticMaterial: {
          detailTexture: "./4.png",
          textureTiling: 2,
        },
        itemStyle: {
          color: "transparent",
        },
      },
    ],
  };
  return option;
};

/**
 * 返回上级地图功能
 */

type HistoryData = {
  name: string;
  adcode: string | undefined;
};
// 地图下钻历史记录
const historyMapData = ref<HistoryData[]>([{ name: "map", adcode: "100000" }]);
// 返回上级地图
const backMap = () => {
  const myChart = echarts.init(
    <HTMLElement>document.getElementById("mapEchart")
  );
  // 去除当前的地图信息
  historyMapData.value.pop();
  const len = historyMapData.value.length;
  // 获取上一级的地图信息
  const newdata = historyMapData.value[len - 1];
  // 重新渲染地图
  initMap(myChart, newdata?.name || "map", newdata?.adcode || "100000");
};

/**
 * 生命周期
 */
onMounted(() => {
  // 挂载echart
  chartMap();
});
</script>

<style scoped>
.investment-screen {
  background-color: rgb(0, 0, 42);
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-chart {
  width: 80%;
  height: 80%;
}
</style>
```
### 细节讲解

- 地图配置`getOption`函数中，使用了双地图`geo3D`和`map3D`两种类型，因为`map3D`更友好的支持点击事件，所以为了实现点击下钻的功能，我把`map3D`的视图层级往上提升了，并且透明化了`map3D`每一块区域的颜色

map3D单独配置时：

> 这么做就是为了完成：“鼠标移入相关地区区域时高亮展示红框立体区域内容”的需求

![image.png](https://img-blog.csdnimg.cn/img_convert/27d7f43e253b76628b2637d97f005263.png#averageHue=#040830&clientId=ue6f35d61-4606-4&from=paste&height=715&id=tkUpN&name=image.png&originHeight=715&originWidth=773&originalType=binary&ratio=1&rotation=0&showTitle=false&size=108789&status=done&style=none&taskId=uf417d3f0-bb1d-4506-bc8a-831f7cd68ff&title=&width=773)
而展示给用户的3d地图是由`geo3D`渲染的:
![image.png](https://img-blog.csdnimg.cn/img_convert/c3afb3c65aff16a6a1d1c6390052f758.png#averageHue=#11244d&clientId=ue6f35d61-4606-4&from=paste&height=637&id=u7240ee14&name=image.png&originHeight=637&originWidth=952&originalType=binary&ratio=1&rotation=0&showTitle=false&size=509113&status=done&style=none&taskId=u310c2aef-0e21-4a5d-a17a-93e3c161622&title=&width=952)

- geo3D配置详解：

三维图形的着色效果
`realistic` 真实感渲染
在使用自定义渲染时，材质贴图一定要放到 pubic文件夹 中，否则echarts无法识别。应该是底层echarts打包的时候自己做的处理。

```js
shading: "realistic",
      realisticMaterial: {
        detailTexture: "./1.jpeg",
        roughness: 0.2,
        metalness: 0,
      },
```

- map3D配置详解：

配置鼠标移入时的图标，可以自定义更换 	`image: "./2.png"`

```js
emphasis: {
          label: {
            show: true,
            textStyle: {
              color: "#f8fbfb",
              // borderColor: "#17E8F4",
              fontSize: 18,
              padding: [20, 20],
              backgroundColor: {
                image: "./2.png",
              },
            },
          },
          itemStyle: {
            color: "#18B6FE",
          },
        },
```

# 总结

本文中**地图下钻**和**返回上一级地图**的整体功能需求基本完善。

- 可拓展的新功能：

添加动态3d柱状图 (已完成-github项目启动后访问路径：“/Vue3Point” 点击“城市消费水平”的内容，待使用柏林噪声优化柱状图分布)
添加动态3d散点图
添加动态3d折线图
。。。等等功能待开发
