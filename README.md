# Map3D
基于Vue框架、Echarts、Echarts-gl、Three包渲染的3D地图案例展示。
3D map case display based on Vue framework, Echarts, Echarts gl and Three package rendering.

> 组件都已经封装好，直接复制文件拿走，不用重复造轮子。

相关文章教程：
[【3d地图】vue中使用echarts geo3D](https://blog.csdn.net/m0_68324632/article/details/125441532?spm=1001.2014.3001.5502)
[【3d地图】vue3.0中使用echarts geo3D](https://blog.csdn.net/m0_68324632/article/details/125562551)
[【vue】Echarts3D地图下钻](https://blog.csdn.net/m0_68324632/article/details/130133913)


# Menu 
├── src 

|  ├── views  

|  |  ├── Index 

|  |  |  ├── BaseMap.vue // 【3d地图】vue中使用echarts geo3D 

|  |  |  ├── index.vue // 首页 

|  |  |  ├── vue2Version.vue // 【vue2.0】Echarts3D地图下钻 (记得粘贴public内的图片，可自己替换) 

|  |  |  └── vue3Version.vue // 【vue3.0】Echarts3D地图下钻 (记得粘贴public内的图片，可自己替换) 

|  |  ├── Point 

|  |  |  ├── generateUniformPoints.ts // 生成地图区域内散点 

|  |  |  └── index.vue // 组件 

|  |  └── Three 

|  |     ├── Map.vue // 组件 

|  |     └── map.js // three核心代码 

# Setup
Make sure to install the dependencies:

## yarn
yarn install

## npm
npm install

## pnpm
pnpm install --shamefully-hoist
Development Server
Start the development server on http://localhost:5173

npm run dev
Production
Build the application for production:

npm run build
Locally preview production build:

npm run preview
Check out the deployment documentation for more information.
