import{C as v,G as w,T as y,a as x,F as C,P as b,O as z,W as k,b as L,c as _,M as u,d as l,S as M,e as m,E as P,L as A,f as g,g as T}from"./three-adcdec46.js";import{_ as I}from"./index-cb197c86.js";import{o as S,f as E,g as O}from"./@vue-ff7d0d90.js";import"./vue-router-de5451fa.js";class f{constructor(){this.callbacks={},this.callbacks.base={}}on(e,s){return typeof e>"u"||e===""?(console.warn("wrong names"),!1):typeof s>"u"?(console.warn("wrong callback"),!1):(this.resolveNames(e).forEach(i=>{const a=this.resolveName(i);this.callbacks[a.namespace]instanceof Object||(this.callbacks[a.namespace]={}),this.callbacks[a.namespace][a.value]instanceof Array||(this.callbacks[a.namespace][a.value]=[]),this.callbacks[a.namespace][a.value].push(s)}),this)}off(e){return typeof e>"u"||e===""?(console.warn("wrong name"),!1):(this.resolveNames(e).forEach(t=>{const i=this.resolveName(t);if(i.namespace!=="base"&&i.value==="")delete this.callbacks[i.namespace];else if(i.namespace==="base")for(const a in this.callbacks)this.callbacks[a]instanceof Object&&this.callbacks[a][i.value]instanceof Array&&(delete this.callbacks[a][i.value],Object.keys(this.callbacks[a]).length===0&&delete this.callbacks[a]);else this.callbacks[i.namespace]instanceof Object&&this.callbacks[i.namespace][i.value]instanceof Array&&(delete this.callbacks[i.namespace][i.value],Object.keys(this.callbacks[i.namespace]).length===0&&delete this.callbacks[i.namespace])}),this)}trigger(e,s){const t=this;if(typeof e>"u"||e==="")return console.warn("wrong name"),!1;let i="";const a=s instanceof Array?s:[];let o=this.resolveNames(e);if(o=this.resolveName(o[0]),o.namespace==="base")for(const r in this.callbacks)this.callbacks[r]instanceof Object&&this.callbacks[r][o.value]instanceof Array&&this.callbacks[r][o.value].forEach(function(p){p.apply(t,a)});else if(this.callbacks[o.namespace]instanceof Object){if(o.value==="")return console.warn("wrong name"),this;this.callbacks[o.namespace][o.value].forEach(function(r){r.apply(t,a)})}return i}resolveNames(e){let s=e;return s=s.replace(/[^a-zA-Z0-9 ,/.]/g,""),s=s.replace(/[,/]+/g," "),s=s.split(" "),s}resolveName(e){const s={original:"",value:"",namespace:""},t=e.split(".");return s.original=e,s.value=t[0],s.namespace="base",t.length>1&&t[1]!==""&&(s.namespace=t[1]),s}}class D extends f{constructor(e){super(),this.resizeHandler=()=>{if(this.width=window.innerWidth,this.height=window.innerHeight,e&&e.id){const s=document.getElementById(e.id);if(s){const t=s.parentElement;t?(this.width=t.clientWidth,this.height=t.clientHeight):console.error("tips: The parent document cannot be found. Please put the current component inside the parent document ID according to the configuration item.")}else this.release(),console.error("tips: Could not find parent element ID, please check the configuration")}this.pixelRatio=Math.min(window.devicePixelRatio,2),this.height<200&&(this.height=1080),this.trigger("resize",null)},this.resizeHandler(),window.addEventListener("resize",this.resizeHandler)}release(){window.removeEventListener("resize",this.resizeHandler)}}class N extends f{constructor(){super(),this.clock=new v,this.start=Date.now(),this.current=this.start,this.elapsed=0,this.delta=16,this.timer=0,this.index=0,this.tick()}tick(){const e=Date.now();this.delta=e-this.current,this.current=e,this.elapsed=e-this.start,this.elapsedTime=this.clock.getElapsedTime(),this.trigger("tick",null),window.requestAnimationFrame(()=>{this.tick()})}release(){window.cancelAnimationFrame(this.tick)}tickS(e=1e3,s){this.timer+=this.delta,this.timer>=e&&(this.index++,this.timer=0,s(this.index))}}class R extends f{constructor(e){super(),console.log(e,111),this.sources=e,this.items={},this.toLoad=this.sources.length,this.loaded=0,this.setLoaders(),this.startLoading()}setLoaders(){this.loaders={},this.loaders.gltfLoader=new w,this.loaders.textureLoader=new y,this.loaders.cubeTextureLoader=new x,this.loaders.fontLoader=new C}startLoading(){for(const e of this.sources)e.type==="gltfModel"?this.loaders.gltfLoader.load(e.path,s=>{this.sourceLoaded(e,s)}):e.type==="texture"?this.loaders.textureLoader.load(e.path,s=>{this.sourceLoaded(e,s)}):e.type==="cubeTexture"?this.loaders.cubeTextureLoader.load(e.path,s=>{this.sourceLoaded(e,s)}):e.type==="font"&&this.loaders.fontLoader.load(e.path,s=>{this.sourceLoaded(e,s)})}sourceLoaded(e,s){this.items[e.name]=s,this.loaded++,this.loaded===this.toLoad&&this.trigger("ready")}}class F{constructor(e){this.experience=new d,this.sizes=this.experience.sizes,this.scene=this.experience.scene,this.canvas=this.experience.canvas,this.cameraConfig=e,this.setInstance(),this.setControls()}setInstance(){var e,s;this.instance=new b(this.cameraConfig.fov,((e=this.sizes)==null?void 0:e.width)/((s=this.sizes)==null?void 0:s.height),this.cameraConfig.near,this.cameraConfig.far),this.instance.position.set(this.cameraConfig.position.x,this.cameraConfig.position.y,this.cameraConfig.position.z),this.cameraConfig.lookAt&&this.instance.lookAt(this.scene.position),this.scene.add(this.instance)}setControls(){this.controls=new z(this.instance,this.canvas),this.controls.enableDamping=!0}resize(){var e,s;this.instance.aspect=((e=this.sizes)==null?void 0:e.width)/((s=this.sizes)==null?void 0:s.height),this.instance.updateProjectionMatrix()}update(){this.controls.update()}dispose(){this.controls.dispose()}}class B{constructor(e){this.experience=new d,this.canvas=this.experience.canvas,this.sizes=this.experience.sizes,this.scene=this.experience.scene,this.camera=this.experience.camera,this.renderderConfig=e,this.setInstance()}setInstance(){this.instance=new k({canvas:this.canvas,antialias:!0,alpha:!0}),this.instance.useLegacyLights=!0,this.instance.toneMapping=L,this.instance.toneMappingExposure=1.75,this.instance.shadowMap.enabled=!0,this.instance.shadowMap.type=_,this.renderderConfig.clearAlpha?this.instance.setClearAlpha(this.renderderConfig.clearAlpha):this.instance.setClearAlpha(0),this.instance.setSize(this.sizes.width,this.sizes.height),this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio,2))}resize(){var e;this.instance.setSize((e=this.sizes)==null?void 0:e.width,this.sizes.height),this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio,2))}update(){var e;this.instance.render(this.scene,(e=this.camera)==null?void 0:e.instance)}info(e="当前内存："){console.log(e,this.instance.info.memory)}dispose(){this.instance.clear(),this.instance.setSize(0,0),this.instance.dispose(),this.info("清空内存后：")}}const H=`
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
`,G=`
varying vec3 vPosition;

void main(){
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;class W{constructor(){this.experience=new d,this.scene=this.experience.scene,this.resources=this.experience.resources,this.city=null,this.resources.on("ready",()=>{this.resources.items.shanghai.scene.traverse(e=>{if(e.isMesh)if(["CITY_UNTRIANGULATED"].includes(e.name))this.setCityLineMaterial(e),this.setCityMaterial(e);else if(["ROADS"].includes(e.name)){const s=new u({color:"rgb(41,46,76)"}),t=new l(e.geometry,s);t.rotateX(-Math.PI/2),t.position.set(e.position.x,e.position.y,e.position.z),this.scene.add(t)}else{const s=new u({color:"#040912"}),t=new l(e.geometry,s);this.scene.add(t),t.rotateX(-Math.PI/2),t.position.set(e.position.x,e.position.y,e.position.z)}})})}update(){this.city&&(this.city.material.uniforms.height.value+=.2,this.city.material.uniforms.height.value>100&&(this.city.material.uniforms.height.value=0))}setCityMaterial(e){const s=new M({uniforms:{height:{value:20},uFlowColor:{value:new m("#5588aa")},uCityColor:{value:new m("#1B3045")}},vertexShader:G,fragmentShader:H,transparent:!0});this.city=new l(e.geometry,s),this.city.position.set(e.position.x,e.position.y,e.position.z),this.city.name="city",this.scene.add(this.city),this.city.rotateX(-Math.PI/2)}setCityLineMaterial(e){const s=new P(e.geometry,1),t=new A({color:"rgba(38,133,254)"}),i=new g(s,t);i.position.set(e.position.x,e.position.y,e.position.z),this.scene.add(i),i.rotateX(-Math.PI/2)}}let h=null;class d{constructor(e,s){if(h)return h;h=this,window.experience=this,this.canvas=e;const{camera:t,renderer:i}=s;this.sizes=new D,this.time=new N,this.scene=new T,this.resources=new R([{name:"shanghai",type:"gltfModel",path:"/gltf/shanghai.gltf"}]),this.camera=new F(t),this.renderer=new B(i),this.world=new W,this.sizes.on("resize",()=>{this.resize()}),this.time.on("tick",()=>{this.update()})}resize(){var e,s;(e=this.camera)==null||e.resize(),(s=this.renderer)==null||s.resize()}update(){var e,s;(e=this.camera)==null||e.update(),this.world.update(),(s=this.renderer)==null||s.update()}dispose(){var e,s,t,i,a,o;(e=this.sizes)==null||e.off("resize"),(s=this.time)==null||s.off("tick"),(t=this.scene)==null||t.traverse(r=>{if((r instanceof l||r instanceof g)&&(r.geometry.dispose(),Array.isArray(r.material)))for(const p of r.material){const c=r.material[p];c&&c.hasOwnProperty("dispose")&&typeof c.dispose=="function"&&c.dispose()}}),(i=this.scene)==null||i.clear(),(a=this.renderer)==null||a.dispose(),(o=this.camera)==null||o.dispose(),h=null}}const $={el:"pc-three-city3D",icon:"icon-ic_city",adaptation:"pc",useSource:"v10",name:"上海城市风",type:"chart",rootType:"preset2",fetchOptions:{},chartOptions:{camera:{fov:60,near:1,far:1e4,position:{x:600,y:600,z:600},lookAt:!0},renderer:{clearAlpha:0}}};const X={name:"City",data(){return{_three_instance:null}},mounted(){var n;(n=this._three_instance)==null||n.dispose(),this._three_instance=new d(this.$refs.webgl,$.chartOptions)},beforeDestroy(){var n;(n=this._three_instance)==null||n.dispose()},methods:{}},j={ref:"box",class:"china-chart",id:"_Background_3D"},Y={class:"webgl",ref:"webgl",id:"scene"};function q(n,e,s,t,i,a){return S(),E("div",j,[O("canvas",Y,null,512)],512)}const K=I(X,[["render",q],["__scopeId","data-v-865567c9"]]);export{K as default};