let pathName = location.pathname.includes('ChartsCab') ? '/ChartsCab/' : location.pathname

export default [
  {
    name: "shanghai",
    type: "gltfModel",
    path: location.origin + pathName + 'static/shanghai.gltf',
  },
  
];
