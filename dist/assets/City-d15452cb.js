import{d as g,O as y,W as v,a9 as x,aa as C,u as d,o as c,l as w,Z as f,ab as z,ac as _,ad as m,a4 as M,a5 as P,a6 as S,a7 as I}from"./OrbitControls-5a43fa8b.js";import{_ as A,o as L,c as k,b as R}from"./index-4f325cd5.js";class D{constructor(e){this.experience=new h,this.sizes=this.experience.sizes,this.scene=this.experience.scene,this.canvas=this.experience.canvas,this.cameraConfig=e,this.setInstance(),this.setControls()}setInstance(){var e,s;this.instance=new g(this.cameraConfig.fov,((e=this.sizes)==null?void 0:e.width)/((s=this.sizes)==null?void 0:s.height),this.cameraConfig.near,this.cameraConfig.far),this.instance.position.set(this.cameraConfig.position.x,this.cameraConfig.position.y,this.cameraConfig.position.z),this.cameraConfig.lookAt&&this.instance.lookAt(this.scene.position),this.scene.add(this.instance)}setControls(){this.controls=new y(this.instance,this.canvas),this.controls.enableDamping=!0}resize(){var e,s;this.instance.aspect=((e=this.sizes)==null?void 0:e.width)/((s=this.sizes)==null?void 0:s.height),this.instance.updateProjectionMatrix()}update(){this.controls.update()}dispose(){this.controls.dispose()}}class T{constructor(e){this.experience=new h,this.canvas=this.experience.canvas,this.sizes=this.experience.sizes,this.scene=this.experience.scene,this.camera=this.experience.camera,this.renderderConfig=e,this.setInstance()}setInstance(){this.instance=new v({canvas:this.canvas,antialias:!0,alpha:!0}),this.instance.useLegacyLights=!0,this.instance.toneMapping=x,this.instance.toneMappingExposure=1.75,this.instance.shadowMap.enabled=!0,this.instance.shadowMap.type=C,this.renderderConfig.clearAlpha?this.instance.setClearAlpha(this.renderderConfig.clearAlpha):this.instance.setClearAlpha(0),this.instance.setSize(this.sizes.width,this.sizes.height),this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio,2))}resize(){var e;this.instance.setSize((e=this.sizes)==null?void 0:e.width,this.sizes.height),this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio,2))}update(){var e;this.instance.render(this.scene,(e=this.camera)==null?void 0:e.instance)}info(e="当前内存："){console.log(e,this.instance.info.memory)}dispose(){this.instance.clear(),this.instance.setSize(0,0),this.instance.dispose(),this.info("清空内存后：")}}const b=`
float distanceTo(vec2 src,vec2 dst){
    float dx=src.x-dst.x;
    float dy=src.y-dst.y;
    float dv=dx*dx+dy*dy;
    return sqrt(dv);
}
varying vec3 vPosition;
uniform float height;
uniform vec3 uFlowColor;
uniform vec3 uCityColor;
void main(){
    //模型的基础颜色
    vec3 distColor=uCityColor;
    // 流动范围当前点z的高度加上流动线的高度
    float topY=vPosition.z+10.;
    if(height>vPosition.z&&height<topY){
        // 颜色渐变
            float dIndex = sin((height - vPosition.z) / 10.0 * 3.14);
            distColor = mix(uFlowColor, distColor, 1.0-dIndex);
    }
    //定位当前点位位置
    vec2 position2D=vec2(vPosition.x,vPosition.y);
    //求点到原点的距离
    float Len=distanceTo(position2D,vec2(0,0));
      if(Len>height*30.0&&Len<(height*30.0+130.0)){
        // 颜色渐变
        float dIndex = sin((Len - height*30.0) / 130.0 * 3.14);
        distColor= mix(uFlowColor, distColor, 1.0-dIndex);
    }
    gl_FragColor=vec4(distColor,1.0);
}
`,B=`
varying vec3 vPosition;

void main(){
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;class O{constructor(){this.experience=new h,this.scene=this.experience.scene,this.resources=this.experience.resources,this.city=null,this.resources.on("ready",()=>{this.resources.items.shanghai.scene.traverse(e=>{if(e.isMesh)if(["CITY_UNTRIANGULATED"].includes(e.name))this.setCityLineMaterial(e),this.setCityMaterial(e);else if(["ROADS"].includes(e.name)){const s=new d({color:"rgb(41,46,76)"}),t=new c(e.geometry,s);t.rotateX(-Math.PI/2),t.position.set(e.position.x,e.position.y,e.position.z),this.scene.add(t)}else{const s=new d({color:"#040912"}),t=new c(e.geometry,s);this.scene.add(t),t.rotateX(-Math.PI/2),t.position.set(e.position.x,e.position.y,e.position.z)}})})}update(){this.city&&(this.city.material.uniforms.height.value+=.2,this.city.material.uniforms.height.value>100&&(this.city.material.uniforms.height.value=0))}setCityMaterial(e){const s=new w({uniforms:{height:{value:20},uFlowColor:{value:new f("#5588aa")},uCityColor:{value:new f("#1B3045")}},vertexShader:B,fragmentShader:b,transparent:!0});this.city=new c(e.geometry,s),this.city.position.set(e.position.x,e.position.y,e.position.z),this.city.name="city",this.scene.add(this.city),this.city.rotateX(-Math.PI/2)}setCityLineMaterial(e){const s=new z(e.geometry,1),t=new _({color:"rgba(38,133,254)"}),n=new m(s,t);n.position.set(e.position.x,e.position.y,e.position.z),this.scene.add(n),n.rotateX(-Math.PI/2)}}let r=null;class h{constructor(e,s){if(r)return r;r=this,window.experience=this,this.canvas=e;const{camera:t,renderer:n}=s;this.sizes=new M,this.time=new P,this.scene=new S,this.resources=new I([{name:"shanghai",type:"gltfModel",path:"/gltf/shanghai.gltf"}]),this.camera=new D(t),this.renderer=new T(n),this.world=new O,this.sizes.on("resize",()=>{this.resize()}),this.time.on("tick",()=>{this.update()})}resize(){var e,s;(e=this.camera)==null||e.resize(),(s=this.renderer)==null||s.resize()}update(){var e,s;(e=this.camera)==null||e.update(),this.world.update(),(s=this.renderer)==null||s.update()}dispose(){var e,s,t,n,p,l;(e=this.sizes)==null||e.off("resize"),(s=this.time)==null||s.off("tick"),(t=this.scene)==null||t.traverse(a=>{if((a instanceof c||a instanceof m)&&(a.geometry.dispose(),Array.isArray(a.material)))for(const u of a.material){const o=a.material[u];o&&o.hasOwnProperty("dispose")&&typeof o.dispose=="function"&&o.dispose()}}),(n=this.scene)==null||n.clear(),(p=this.renderer)==null||p.dispose(),(l=this.camera)==null||l.dispose(),r=null}}const F={el:"pc-three-city3D",icon:"icon-ic_city",adaptation:"pc",useSource:"v10",name:"上海城市风",type:"chart",rootType:"preset2",fetchOptions:{},chartOptions:{camera:{fov:60,near:1,far:1e4,position:{x:600,y:600,z:600},lookAt:!0},renderer:{clearAlpha:0}}};const E={name:"City",data(){return{_three_instance:null}},mounted(){var i;(i=this._three_instance)==null||i.dispose(),this._three_instance=new h(this.$refs.webgl,F.chartOptions)},beforeDestroy(){var i;(i=this._three_instance)==null||i.dispose()},methods:{}},$={ref:"box",class:"china-chart",id:"_Background_3D"},X={class:"webgl",ref:"webgl",id:"scene"};function G(i,e,s,t,n,p){return L(),k("div",$,[R("canvas",X,null,512)],512)}const Y=A(E,[["render",G],["__scopeId","data-v-865567c9"]]);export{Y as default};
