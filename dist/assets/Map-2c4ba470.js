var Sr=Object.defineProperty;var wr=(r,e,t)=>e in r?Sr(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var Tt=(r,e,t)=>(wr(r,typeof e!="symbol"?e+"":e,t),t);import{E as yr,V as O,G as ie,S as Tr,a as Mr,H as br,b as Er,A as Cr,P as Pr,c as _r,d as zr,O as Ar,W as Dr,e as Gi,B as Jt,f as F,I as Br,F as Ge,g as zt,h as Ce,i as Rr,j as Hi,U as ze,k as et,l as Z,m as tt,n as yt,M as Vi,L as Ur,o as _e,p as Or,q as Wi,R as ai,s as rt,r as Nr,t as Ir,u as He,v as Lr,w as $i,x as Fr,y as kr,T as Qi,z as Gr,C as ji,D as oi,J as li,K as Hr,N as te,Q as le,X as At,Y as Vr,Z as ce,_ as Yi,$ as Wr,a0 as $r,a1 as Qr,a2 as ci,a3 as jr,a4 as Yr,a5 as Xr,a6 as qr,a7 as Zr,a8 as Jr}from"./OrbitControls-5a43fa8b.js";import{_ as Kr,o as en,c as tn,b as rn}from"./index-0573fd42.js";class nn extends yr{constructor(){super(),this.canvas=experience.canvas,this.eventOffset={x:0,y:0},this.mouse=new O,this.mouseMoveHandler=e=>{var u;let{top:t=0,left:i=0,width:n=0,height:a=0}=(u=this.canvas)==null?void 0:u.getBoundingClientRect(),s=e.clientX-i,o=e.clientY-t;this.mouse.x=s/n*2-1,this.mouse.y=-(o/a)*2+1,this.eventOffset.x=s,this.eventOffset.y=o,this.trigger("mousemove",null)},this.canvas&&window.addEventListener("mousemove",this.mouseMoveHandler,!1)}release(){window.removeEventListener("mousemove",this.mouseMoveHandler,!1)}}class sn{constructor(e){this.experience=new se,this.scene=this.experience.scene,this.light=new ie,this.light.name="light-group",this.setLight(e)}setLight(e){if(Array.isArray(e)&&!e.length)return console.error("please add light configuration");let t,i;e.forEach(({color:n,groundColor:a,type:s,intensity:o,distance:u,angle:h,penumbra:l,position:c,decay:f,helper:d})=>{switch(s){case"point":t=new Pr(n,o,u),d&&(i=new _r(t,.5));break;case"ambient":t=new Cr(n,o);break;case"hemisphere":t=new br(n,a,o),d&&(i=new Er(t,.5));break;case"spot":t=new Tr(n,o,u,h,l,f),d&&(i=new Mr(t,.5));break}t.position.set(c.x,c.y,c.z),t.isSpotLight&&this.light.add(t.target),t&&this.light.add(t),i&&this.light.add(i)}),this.scene.add(this.light)}}class an{constructor(e){this.experience=new se,this.sizes=this.experience.sizes,this.scene=this.experience.scene,this.canvas=this.experience.canvas,this.cameraConfig=e,this.setInstance(),e.controls.show&&this.setControls()}setInstance(){var e,t;this.instance=new zr(this.cameraConfig.fov,((e=this.sizes)==null?void 0:e.width)/((t=this.sizes)==null?void 0:t.height),this.cameraConfig.near,this.cameraConfig.far),this.instance.position.set(this.cameraConfig.position.x,this.cameraConfig.position.y,this.cameraConfig.position.z),this.cameraConfig.lookAt&&this.instance.lookAt(this.scene.position),this.instance.updateProjectionMatrix(),this.scene.add(this.instance)}setControls(){this.controls=new Ar(this.instance,this.canvas);const e=this.cameraConfig.controls;this.controls.enableDamping=e.enableDamping,this.controls.minPolarAngle=e.minPolarAngle,this.controls.maxPolarAngle=e.maxPolarAngle,this.controls.minAzimuthAngle=e.minAzimuthAngle,this.controls.maxAzimuthAngle=e.maxAzimuthAngle,this.controls.enablePan=e.enablePan}resize(){var e,t;this.instance.aspect=((e=this.sizes)==null?void 0:e.width)/((t=this.sizes)==null?void 0:t.height),this.instance.updateProjectionMatrix()}update(){var e;(e=this.controls)==null||e.update()}dispose(){var e;(e=this.controls)==null||e.dispose()}}class on{constructor(e){this.experience=new se,this.canvas=this.experience.canvas,this.sizes=this.experience.sizes,this.scene=this.experience.scene,this.camera=this.experience.camera,this.rendererConfig=e,this.setInstance()}setInstance(){this.instance=new Dr({canvas:this.canvas,antialias:this.rendererConfig.antialias,alpha:this.rendererConfig.alpha}),this.instance.useLegacyLights=!0,this.instance.outputColorSpace=Gi,this.rendererConfig.clearAlpha?this.instance.setClearAlpha(this.rendererConfig.clearAlpha):this.instance.setClearAlpha(0),this.rendererConfig.clearColor&&this.instance.setClearColor(this.rendererConfig.clearColor),this.instance.setSize(this.sizes.width,this.sizes.height),this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio,2))}resize(){var e;this.instance.setSize((e=this.sizes)==null?void 0:e.width,this.sizes.height),this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio,2))}update(){var e;this.instance.render(this.scene,(e=this.camera)==null?void 0:e.instance)}info(e="当前内存："){console.log(e,this.instance.info.memory)}dispose(){this.instance.clear(),this.instance.setSize(0,0),this.instance.dispose(),this.info("清空内存后：")}}class de{constructor(){this._partials=new Float64Array(32),this._n=0}add(e){const t=this._partials;let i=0;for(let n=0;n<this._n&&n<32;n++){const a=t[n],s=e+a,o=Math.abs(e)<Math.abs(a)?e-(s-a):a-(s-e);o&&(t[i++]=o),e=s}return t[i]=e,this._n=i+1,this}valueOf(){const e=this._partials;let t=this._n,i,n,a,s=0;if(t>0){for(s=e[--t];t>0&&(i=s,n=e[--t],s=i+n,a=n-(s-i),!a););t>0&&(a<0&&e[t-1]<0||a>0&&e[t-1]>0)&&(n=a*2,i=s+n,n==i-s&&(s=i))}return s}}function*ln(r){for(const e of r)yield*e}function Xi(r){return Array.from(ln(r))}var U=1e-6,Dt=1e-12,C=Math.PI,q=C/2,ui=C/4,K=C*2,W=180/C,D=C/180,I=Math.abs,qi=Math.atan,Te=Math.atan2,z=Math.cos,cn=Math.exp,Bt=Math.hypot,un=Math.log,A=Math.sin,hn=Math.sign||function(r){return r>0?1:r<0?-1:0},xe=Math.sqrt,fn=Math.tan;function dn(r){return r>1?0:r<-1?C:Math.acos(r)}function Me(r){return r>1?q:r<-1?-q:Math.asin(r)}function J(){}function nt(r,e){r&&fi.hasOwnProperty(r.type)&&fi[r.type](r,e)}var hi={Feature:function(r,e){nt(r.geometry,e)},FeatureCollection:function(r,e){for(var t=r.features,i=-1,n=t.length;++i<n;)nt(t[i].geometry,e)}},fi={Sphere:function(r,e){e.sphere()},Point:function(r,e){r=r.coordinates,e.point(r[0],r[1],r[2])},MultiPoint:function(r,e){for(var t=r.coordinates,i=-1,n=t.length;++i<n;)r=t[i],e.point(r[0],r[1],r[2])},LineString:function(r,e){Rt(r.coordinates,e,0)},MultiLineString:function(r,e){for(var t=r.coordinates,i=-1,n=t.length;++i<n;)Rt(t[i],e,0)},Polygon:function(r,e){di(r.coordinates,e)},MultiPolygon:function(r,e){for(var t=r.coordinates,i=-1,n=t.length;++i<n;)di(t[i],e)},GeometryCollection:function(r,e){for(var t=r.geometries,i=-1,n=t.length;++i<n;)nt(t[i],e)}};function Rt(r,e,t){var i=-1,n=r.length-t,a;for(e.lineStart();++i<n;)a=r[i],e.point(a[0],a[1],a[2]);e.lineEnd()}function di(r,e){var t=-1,i=r.length;for(e.polygonStart();++t<i;)Rt(r[t],e,1);e.polygonEnd()}function we(r,e){r&&hi.hasOwnProperty(r.type)?hi[r.type](r,e):nt(r,e)}function Ut(r){return[Te(r[1],r[0]),Me(r[2])]}function Ae(r){var e=r[0],t=r[1],i=z(t);return[i*z(e),i*A(e),A(t)]}function Qe(r,e){return r[0]*e[0]+r[1]*e[1]+r[2]*e[2]}function st(r,e){return[r[1]*e[2]-r[2]*e[1],r[2]*e[0]-r[0]*e[2],r[0]*e[1]-r[1]*e[0]]}function Mt(r,e){r[0]+=e[0],r[1]+=e[1],r[2]+=e[2]}function je(r,e){return[r[0]*e,r[1]*e,r[2]*e]}function Ot(r){var e=xe(r[0]*r[0]+r[1]*r[1]+r[2]*r[2]);r[0]/=e,r[1]/=e,r[2]/=e}var Oe,at,ot,lt,ct,ut,ht,ft,Nt,It,Lt,Zi,Ji,$,Q,j,ne={sphere:J,point:Kt,lineStart:pi,lineEnd:mi,polygonStart:function(){ne.lineStart=gn,ne.lineEnd=vn},polygonEnd:function(){ne.lineStart=pi,ne.lineEnd=mi}};function Kt(r,e){r*=D,e*=D;var t=z(e);We(t*z(r),t*A(r),A(e))}function We(r,e,t){++Oe,ot+=(r-ot)/Oe,lt+=(e-lt)/Oe,ct+=(t-ct)/Oe}function pi(){ne.point=pn}function pn(r,e){r*=D,e*=D;var t=z(e);$=t*z(r),Q=t*A(r),j=A(e),ne.point=mn,We($,Q,j)}function mn(r,e){r*=D,e*=D;var t=z(e),i=t*z(r),n=t*A(r),a=A(e),s=Te(xe((s=Q*a-j*n)*s+(s=j*i-$*a)*s+(s=$*n-Q*i)*s),$*i+Q*n+j*a);at+=s,ut+=s*($+($=i)),ht+=s*(Q+(Q=n)),ft+=s*(j+(j=a)),We($,Q,j)}function mi(){ne.point=Kt}function gn(){ne.point=xn}function vn(){Ki(Zi,Ji),ne.point=Kt}function xn(r,e){Zi=r,Ji=e,r*=D,e*=D,ne.point=Ki;var t=z(e);$=t*z(r),Q=t*A(r),j=A(e),We($,Q,j)}function Ki(r,e){r*=D,e*=D;var t=z(e),i=t*z(r),n=t*A(r),a=A(e),s=Q*a-j*n,o=j*i-$*a,u=$*n-Q*i,h=Bt(s,o,u),l=Me(h),c=h&&-l/h;Nt.add(c*s),It.add(c*o),Lt.add(c*u),at+=l,ut+=l*($+($=i)),ht+=l*(Q+(Q=n)),ft+=l*(j+(j=a)),We($,Q,j)}function Sn(r){Oe=at=ot=lt=ct=ut=ht=ft=0,Nt=new de,It=new de,Lt=new de,we(r,ne);var e=+Nt,t=+It,i=+Lt,n=Bt(e,t,i);return n<Dt&&(e=ut,t=ht,i=ft,at<U&&(e=ot,t=lt,i=ct),n=Bt(e,t,i),n<Dt)?[NaN,NaN]:[Te(t,e)*W,Me(i/n)*W]}function Ft(r,e){function t(i,n){return i=r(i,n),e(i[0],i[1])}return r.invert&&e.invert&&(t.invert=function(i,n){return i=e.invert(i,n),i&&r.invert(i[0],i[1])}),t}function kt(r,e){return I(r)>C&&(r-=Math.round(r/K)*K),[r,e]}kt.invert=kt;function er(r,e,t){return(r%=K)?e||t?Ft(vi(r),xi(e,t)):vi(r):e||t?xi(e,t):kt}function gi(r){return function(e,t){return e+=r,I(e)>C&&(e-=Math.round(e/K)*K),[e,t]}}function vi(r){var e=gi(r);return e.invert=gi(-r),e}function xi(r,e){var t=z(r),i=A(r),n=z(e),a=A(e);function s(o,u){var h=z(u),l=z(o)*h,c=A(o)*h,f=A(u),d=f*t+l*i;return[Te(c*n-d*a,l*t-f*i),Me(d*n+c*a)]}return s.invert=function(o,u){var h=z(u),l=z(o)*h,c=A(o)*h,f=A(u),d=f*n-c*a;return[Te(c*n+f*a,l*t+d*i),Me(d*t-l*i)]},s}function wn(r){r=er(r[0]*D,r[1]*D,r.length>2?r[2]*D:0);function e(t){return t=r(t[0]*D,t[1]*D),t[0]*=W,t[1]*=W,t}return e.invert=function(t){return t=r.invert(t[0]*D,t[1]*D),t[0]*=W,t[1]*=W,t},e}function yn(r,e,t,i,n,a){if(t){var s=z(e),o=A(e),u=i*t;n==null?(n=e+i*K,a=e-u/2):(n=Si(s,n),a=Si(s,a),(i>0?n<a:n>a)&&(n+=i*K));for(var h,l=n;i>0?l>a:l<a;l-=u)h=Ut([s,-o*z(l),-o*A(l)]),r.point(h[0],h[1])}}function Si(r,e){e=Ae(e),e[0]-=r,Ot(e);var t=dn(-e[1]);return((-e[2]<0?-t:t)+K-U)%K}function tr(){var r=[],e;return{point:function(t,i,n){e.push([t,i,n])},lineStart:function(){r.push(e=[])},lineEnd:J,rejoin:function(){r.length>1&&r.push(r.pop().concat(r.shift()))},result:function(){var t=r;return r=[],e=null,t}}}function it(r,e){return I(r[0]-e[0])<U&&I(r[1]-e[1])<U}function Ye(r,e,t,i){this.x=r,this.z=e,this.o=t,this.e=i,this.v=!1,this.n=this.p=null}function ir(r,e,t,i,n){var a=[],s=[],o,u;if(r.forEach(function(p){if(!((x=p.length-1)<=0)){var x,g=p[0],M=p[x],w;if(it(g,M)){if(!g[2]&&!M[2]){for(n.lineStart(),o=0;o<x;++o)n.point((g=p[o])[0],g[1]);n.lineEnd();return}M[0]+=2*U}a.push(w=new Ye(g,p,null,!0)),s.push(w.o=new Ye(g,null,w,!1)),a.push(w=new Ye(M,p,null,!1)),s.push(w.o=new Ye(M,null,w,!0))}}),!!a.length){for(s.sort(e),wi(a),wi(s),o=0,u=s.length;o<u;++o)s[o].e=t=!t;for(var h=a[0],l,c;;){for(var f=h,d=!0;f.v;)if((f=f.n)===h)return;l=f.z,n.lineStart();do{if(f.v=f.o.v=!0,f.e){if(d)for(o=0,u=l.length;o<u;++o)n.point((c=l[o])[0],c[1]);else i(f.x,f.n.x,1,n);f=f.n}else{if(d)for(l=f.p.z,o=l.length-1;o>=0;--o)n.point((c=l[o])[0],c[1]);else i(f.x,f.p.x,-1,n);f=f.p}f=f.o,l=f.z,d=!d}while(!f.v);n.lineEnd()}}}function wi(r){if(e=r.length){for(var e,t=0,i=r[0],n;++t<e;)i.n=n=r[t],n.p=i,i=n;i.n=n=r[0],n.p=i}}function bt(r){return I(r[0])<=C?r[0]:hn(r[0])*((I(r[0])+C)%K-C)}function Tn(r,e){var t=bt(e),i=e[1],n=A(i),a=[A(t),-z(t),0],s=0,o=0,u=new de;n===1?i=q+U:n===-1&&(i=-q-U);for(var h=0,l=r.length;h<l;++h)if(f=(c=r[h]).length)for(var c,f,d=c[f-1],p=bt(d),x=d[1]/2+ui,g=A(x),M=z(x),w=0;w<f;++w,p=v,g=T,M=B,d=S){var S=c[w],v=bt(S),y=S[1]/2+ui,T=A(y),B=z(y),P=v-p,_=P>=0?1:-1,N=_*P,b=N>C,Y=g*T;if(u.add(Te(Y*_*A(N),M*B+Y*z(N))),s+=b?P+_*K:P,b^p>=t^v>=t){var L=st(Ae(d),Ae(S));Ot(L);var R=st(a,L);Ot(R);var m=(b^P>=0?-1:1)*Me(R[2]);(i>m||i===m&&(L[0]||L[1]))&&(o+=b^P>=0?1:-1)}}return(s<-U||s<U&&u<-Dt)^o&1}function rr(r,e,t,i){return function(n){var a=e(n),s=tr(),o=e(s),u=!1,h,l,c,f={point:d,lineStart:x,lineEnd:g,polygonStart:function(){f.point=M,f.lineStart=w,f.lineEnd=S,l=[],h=[]},polygonEnd:function(){f.point=d,f.lineStart=x,f.lineEnd=g,l=Xi(l);var v=Tn(h,i);l.length?(u||(n.polygonStart(),u=!0),ir(l,bn,v,t,n)):v&&(u||(n.polygonStart(),u=!0),n.lineStart(),t(null,null,1,n),n.lineEnd()),u&&(n.polygonEnd(),u=!1),l=h=null},sphere:function(){n.polygonStart(),n.lineStart(),t(null,null,1,n),n.lineEnd(),n.polygonEnd()}};function d(v,y){r(v,y)&&n.point(v,y)}function p(v,y){a.point(v,y)}function x(){f.point=p,a.lineStart()}function g(){f.point=d,a.lineEnd()}function M(v,y){c.push([v,y]),o.point(v,y)}function w(){o.lineStart(),c=[]}function S(){M(c[0][0],c[0][1]),o.lineEnd();var v=o.clean(),y=s.result(),T,B=y.length,P,_,N;if(c.pop(),h.push(c),c=null,!!B){if(v&1){if(_=y[0],(P=_.length-1)>0){for(u||(n.polygonStart(),u=!0),n.lineStart(),T=0;T<P;++T)n.point((N=_[T])[0],N[1]);n.lineEnd()}return}B>1&&v&2&&y.push(y.pop().concat(y.shift())),l.push(y.filter(Mn))}}return f}}function Mn(r){return r.length>1}function bn(r,e){return((r=r.x)[0]<0?r[1]-q-U:q-r[1])-((e=e.x)[0]<0?e[1]-q-U:q-e[1])}const yi=rr(function(){return!0},En,Pn,[-C,-q]);function En(r){var e=NaN,t=NaN,i=NaN,n;return{lineStart:function(){r.lineStart(),n=1},point:function(a,s){var o=a>0?C:-C,u=I(a-e);I(u-C)<U?(r.point(e,t=(t+s)/2>0?q:-q),r.point(i,t),r.lineEnd(),r.lineStart(),r.point(o,t),r.point(a,t),n=0):i!==o&&u>=C&&(I(e-i)<U&&(e-=i*U),I(a-o)<U&&(a-=o*U),t=Cn(e,t,a,s),r.point(i,t),r.lineEnd(),r.lineStart(),r.point(o,t),n=0),r.point(e=a,t=s),i=o},lineEnd:function(){r.lineEnd(),e=t=NaN},clean:function(){return 2-n}}}function Cn(r,e,t,i){var n,a,s=A(r-t);return I(s)>U?qi((A(e)*(a=z(i))*A(t)-A(i)*(n=z(e))*A(r))/(n*a*s)):(e+i)/2}function Pn(r,e,t,i){var n;if(r==null)n=t*q,i.point(-C,n),i.point(0,n),i.point(C,n),i.point(C,0),i.point(C,-n),i.point(0,-n),i.point(-C,-n),i.point(-C,0),i.point(-C,n);else if(I(r[0]-e[0])>U){var a=r[0]<e[0]?C:-C;n=t*a/2,i.point(-a,n),i.point(0,n),i.point(a,n)}else i.point(e[0],e[1])}function _n(r){var e=z(r),t=6*D,i=e>0,n=I(e)>U;function a(l,c,f,d){yn(d,r,t,f,l,c)}function s(l,c){return z(l)*z(c)>e}function o(l){var c,f,d,p,x;return{lineStart:function(){p=d=!1,x=1},point:function(g,M){var w=[g,M],S,v=s(g,M),y=i?v?0:h(g,M):v?h(g+(g<0?C:-C),M):0;if(!c&&(p=d=v)&&l.lineStart(),v!==d&&(S=u(c,w),(!S||it(c,S)||it(w,S))&&(w[2]=1)),v!==d)x=0,v?(l.lineStart(),S=u(w,c),l.point(S[0],S[1])):(S=u(c,w),l.point(S[0],S[1],2),l.lineEnd()),c=S;else if(n&&c&&i^v){var T;!(y&f)&&(T=u(w,c,!0))&&(x=0,i?(l.lineStart(),l.point(T[0][0],T[0][1]),l.point(T[1][0],T[1][1]),l.lineEnd()):(l.point(T[1][0],T[1][1]),l.lineEnd(),l.lineStart(),l.point(T[0][0],T[0][1],3)))}v&&(!c||!it(c,w))&&l.point(w[0],w[1]),c=w,d=v,f=y},lineEnd:function(){d&&l.lineEnd(),c=null},clean:function(){return x|(p&&d)<<1}}}function u(l,c,f){var d=Ae(l),p=Ae(c),x=[1,0,0],g=st(d,p),M=Qe(g,g),w=g[0],S=M-w*w;if(!S)return!f&&l;var v=e*M/S,y=-e*w/S,T=st(x,g),B=je(x,v),P=je(g,y);Mt(B,P);var _=T,N=Qe(B,_),b=Qe(_,_),Y=N*N-b*(Qe(B,B)-1);if(!(Y<0)){var L=xe(Y),R=je(_,(-N-L)/b);if(Mt(R,B),R=Ut(R),!f)return R;var m=l[0],E=c[0],k=l[1],X=c[1],ee;E<m&&(ee=m,m=E,E=ee);var Ue=E-m,pe=I(Ue-C)<U,Se=pe||Ue<U;if(!pe&&X<k&&(ee=k,k=X,X=ee),Se?pe?k+X>0^R[1]<(I(R[0]-m)<U?k:X):k<=R[1]&&R[1]<=X:Ue>C^(m<=R[0]&&R[0]<=E)){var me=je(_,(-N+L)/b);return Mt(me,B),[R,Ut(me)]}}}function h(l,c){var f=i?r:C-r,d=0;return l<-f?d|=1:l>f&&(d|=2),c<-f?d|=4:c>f&&(d|=8),d}return rr(s,o,a,i?[0,-r]:[-C,r-C])}function zn(r,e,t,i,n,a){var s=r[0],o=r[1],u=e[0],h=e[1],l=0,c=1,f=u-s,d=h-o,p;if(p=t-s,!(!f&&p>0)){if(p/=f,f<0){if(p<l)return;p<c&&(c=p)}else if(f>0){if(p>c)return;p>l&&(l=p)}if(p=n-s,!(!f&&p<0)){if(p/=f,f<0){if(p>c)return;p>l&&(l=p)}else if(f>0){if(p<l)return;p<c&&(c=p)}if(p=i-o,!(!d&&p>0)){if(p/=d,d<0){if(p<l)return;p<c&&(c=p)}else if(d>0){if(p>c)return;p>l&&(l=p)}if(p=a-o,!(!d&&p<0)){if(p/=d,d<0){if(p>c)return;p>l&&(l=p)}else if(d>0){if(p<l)return;p<c&&(c=p)}return l>0&&(r[0]=s+l*f,r[1]=o+l*d),c<1&&(e[0]=s+c*f,e[1]=o+c*d),!0}}}}}var Ne=1e9,Xe=-Ne;function An(r,e,t,i){function n(h,l){return r<=h&&h<=t&&e<=l&&l<=i}function a(h,l,c,f){var d=0,p=0;if(h==null||(d=s(h,c))!==(p=s(l,c))||u(h,l)<0^c>0)do f.point(d===0||d===3?r:t,d>1?i:e);while((d=(d+c+4)%4)!==p);else f.point(l[0],l[1])}function s(h,l){return I(h[0]-r)<U?l>0?0:3:I(h[0]-t)<U?l>0?2:1:I(h[1]-e)<U?l>0?1:0:l>0?3:2}function o(h,l){return u(h.x,l.x)}function u(h,l){var c=s(h,1),f=s(l,1);return c!==f?c-f:c===0?l[1]-h[1]:c===1?h[0]-l[0]:c===2?h[1]-l[1]:l[0]-h[0]}return function(h){var l=h,c=tr(),f,d,p,x,g,M,w,S,v,y,T,B={point:P,lineStart:Y,lineEnd:L,polygonStart:N,polygonEnd:b};function P(m,E){n(m,E)&&l.point(m,E)}function _(){for(var m=0,E=0,k=d.length;E<k;++E)for(var X=d[E],ee=1,Ue=X.length,pe=X[0],Se,me,$e=pe[0],Ee=pe[1];ee<Ue;++ee)Se=$e,me=Ee,pe=X[ee],$e=pe[0],Ee=pe[1],me<=i?Ee>i&&($e-Se)*(i-me)>(Ee-me)*(r-Se)&&++m:Ee<=i&&($e-Se)*(i-me)<(Ee-me)*(r-Se)&&--m;return m}function N(){l=c,f=[],d=[],T=!0}function b(){var m=_(),E=T&&m,k=(f=Xi(f)).length;(E||k)&&(h.polygonStart(),E&&(h.lineStart(),a(null,null,1,h),h.lineEnd()),k&&ir(f,o,m,a,h),h.polygonEnd()),l=h,f=d=p=null}function Y(){B.point=R,d&&d.push(p=[]),y=!0,v=!1,w=S=NaN}function L(){f&&(R(x,g),M&&v&&c.rejoin(),f.push(c.result())),B.point=P,v&&l.lineEnd()}function R(m,E){var k=n(m,E);if(d&&p.push([m,E]),y)x=m,g=E,M=k,y=!1,k&&(l.lineStart(),l.point(m,E));else if(k&&v)l.point(m,E);else{var X=[w=Math.max(Xe,Math.min(Ne,w)),S=Math.max(Xe,Math.min(Ne,S))],ee=[m=Math.max(Xe,Math.min(Ne,m)),E=Math.max(Xe,Math.min(Ne,E))];zn(X,ee,r,e,t,i)?(v||(l.lineStart(),l.point(X[0],X[1])),l.point(ee[0],ee[1]),k||l.lineEnd(),T=!1):k&&(l.lineStart(),l.point(m,E),T=!1)}w=m,S=E,v=k}return B}}const Gt=r=>r;var Et=new de,Ht=new de,nr,sr,Vt,Wt,ge={point:J,lineStart:J,lineEnd:J,polygonStart:function(){ge.lineStart=Dn,ge.lineEnd=Rn},polygonEnd:function(){ge.lineStart=ge.lineEnd=ge.point=J,Et.add(I(Ht)),Ht=new de},result:function(){var r=Et/2;return Et=new de,r}};function Dn(){ge.point=Bn}function Bn(r,e){ge.point=ar,nr=Vt=r,sr=Wt=e}function ar(r,e){Ht.add(Wt*r-Vt*e),Vt=r,Wt=e}function Rn(){ar(nr,sr)}const Ti=ge;var De=1/0,dt=De,Ve=-De,pt=Ve,Un={point:On,lineStart:J,lineEnd:J,polygonStart:J,polygonEnd:J,result:function(){var r=[[De,dt],[Ve,pt]];return Ve=pt=-(dt=De=1/0),r}};function On(r,e){r<De&&(De=r),r>Ve&&(Ve=r),e<dt&&(dt=e),e>pt&&(pt=e)}const mt=Un;var $t=0,Qt=0,Ie=0,gt=0,vt=0,Pe=0,jt=0,Yt=0,Le=0,or,lr,ue,he,re={point:be,lineStart:Mi,lineEnd:bi,polygonStart:function(){re.lineStart=Ln,re.lineEnd=Fn},polygonEnd:function(){re.point=be,re.lineStart=Mi,re.lineEnd=bi},result:function(){var r=Le?[jt/Le,Yt/Le]:Pe?[gt/Pe,vt/Pe]:Ie?[$t/Ie,Qt/Ie]:[NaN,NaN];return $t=Qt=Ie=gt=vt=Pe=jt=Yt=Le=0,r}};function be(r,e){$t+=r,Qt+=e,++Ie}function Mi(){re.point=Nn}function Nn(r,e){re.point=In,be(ue=r,he=e)}function In(r,e){var t=r-ue,i=e-he,n=xe(t*t+i*i);gt+=n*(ue+r)/2,vt+=n*(he+e)/2,Pe+=n,be(ue=r,he=e)}function bi(){re.point=be}function Ln(){re.point=kn}function Fn(){cr(or,lr)}function kn(r,e){re.point=cr,be(or=ue=r,lr=he=e)}function cr(r,e){var t=r-ue,i=e-he,n=xe(t*t+i*i);gt+=n*(ue+r)/2,vt+=n*(he+e)/2,Pe+=n,n=he*r-ue*e,jt+=n*(ue+r),Yt+=n*(he+e),Le+=n*3,be(ue=r,he=e)}const Ei=re;function ur(r){this._context=r}ur.prototype={_radius:4.5,pointRadius:function(r){return this._radius=r,this},polygonStart:function(){this._line=0},polygonEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){this._line===0&&this._context.closePath(),this._point=NaN},point:function(r,e){switch(this._point){case 0:{this._context.moveTo(r,e),this._point=1;break}case 1:{this._context.lineTo(r,e);break}default:{this._context.moveTo(r+this._radius,e),this._context.arc(r,e,this._radius,0,K);break}}},result:J};var Xt=new de,Ct,hr,fr,Fe,ke,xt={point:J,lineStart:function(){xt.point=Gn},lineEnd:function(){Ct&&dr(hr,fr),xt.point=J},polygonStart:function(){Ct=!0},polygonEnd:function(){Ct=null},result:function(){var r=+Xt;return Xt=new de,r}};function Gn(r,e){xt.point=dr,hr=Fe=r,fr=ke=e}function dr(r,e){Fe-=r,ke-=e,Xt.add(xe(Fe*Fe+ke*ke)),Fe=r,ke=e}const Ci=xt;let Pi,St,_i,zi;class Ai{constructor(e){this._append=e==null?pr:Hn(e),this._radius=4.5,this._=""}pointRadius(e){return this._radius=+e,this}polygonStart(){this._line=0}polygonEnd(){this._line=NaN}lineStart(){this._point=0}lineEnd(){this._line===0&&(this._+="Z"),this._point=NaN}point(e,t){switch(this._point){case 0:{this._append`M${e},${t}`,this._point=1;break}case 1:{this._append`L${e},${t}`;break}default:{if(this._append`M${e},${t}`,this._radius!==_i||this._append!==St){const i=this._radius,n=this._;this._="",this._append`m0,${i}a${i},${i} 0 1,1 0,${-2*i}a${i},${i} 0 1,1 0,${2*i}z`,_i=i,St=this._append,zi=this._,this._=n}this._+=zi;break}}}result(){const e=this._;return this._="",e.length?e:null}}function pr(r){let e=1;this._+=r[0];for(const t=r.length;e<t;++e)this._+=arguments[e]+r[e]}function Hn(r){const e=Math.floor(r);if(!(e>=0))throw new RangeError(`invalid digits: ${r}`);if(e>15)return pr;if(e!==Pi){const t=10**e;Pi=e,St=function(n){let a=1;this._+=n[0];for(const s=n.length;a<s;++a)this._+=Math.round(arguments[a]*t)/t+n[a]}}return St}function Vn(r,e){let t=3,i=4.5,n,a;function s(o){return o&&(typeof i=="function"&&a.pointRadius(+i.apply(this,arguments)),we(o,n(a))),a.result()}return s.area=function(o){return we(o,n(Ti)),Ti.result()},s.measure=function(o){return we(o,n(Ci)),Ci.result()},s.bounds=function(o){return we(o,n(mt)),mt.result()},s.centroid=function(o){return we(o,n(Ei)),Ei.result()},s.projection=function(o){return arguments.length?(n=o==null?(r=null,Gt):(r=o).stream,s):r},s.context=function(o){return arguments.length?(a=o==null?(e=null,new Ai(t)):new ur(e=o),typeof i!="function"&&a.pointRadius(i),s):e},s.pointRadius=function(o){return arguments.length?(i=typeof o=="function"?o:(a.pointRadius(+o),+o),s):i},s.digits=function(o){if(!arguments.length)return t;if(o==null)t=null;else{const u=Math.floor(o);if(!(u>=0))throw new RangeError(`invalid digits: ${o}`);t=u}return e===null&&(a=new Ai(t)),s},s.projection(r).digits(t).context(e)}function ei(r){return function(e){var t=new qt;for(var i in r)t[i]=r[i];return t.stream=e,t}}function qt(){}qt.prototype={constructor:qt,point:function(r,e){this.stream.point(r,e)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}};function ti(r,e,t){var i=r.clipExtent&&r.clipExtent();return r.scale(150).translate([0,0]),i!=null&&r.clipExtent(null),we(t,r.stream(mt)),e(mt.result()),i!=null&&r.clipExtent(i),r}function mr(r,e,t){return ti(r,function(i){var n=e[1][0]-e[0][0],a=e[1][1]-e[0][1],s=Math.min(n/(i[1][0]-i[0][0]),a/(i[1][1]-i[0][1])),o=+e[0][0]+(n-s*(i[1][0]+i[0][0]))/2,u=+e[0][1]+(a-s*(i[1][1]+i[0][1]))/2;r.scale(150*s).translate([o,u])},t)}function Wn(r,e,t){return mr(r,[[0,0],e],t)}function $n(r,e,t){return ti(r,function(i){var n=+e,a=n/(i[1][0]-i[0][0]),s=(n-a*(i[1][0]+i[0][0]))/2,o=-a*i[0][1];r.scale(150*a).translate([s,o])},t)}function Qn(r,e,t){return ti(r,function(i){var n=+e,a=n/(i[1][1]-i[0][1]),s=-a*i[0][0],o=(n-a*(i[1][1]+i[0][1]))/2;r.scale(150*a).translate([s,o])},t)}var Di=16,jn=z(30*D);function Bi(r,e){return+e?Xn(r,e):Yn(r)}function Yn(r){return ei({point:function(e,t){e=r(e,t),this.stream.point(e[0],e[1])}})}function Xn(r,e){function t(i,n,a,s,o,u,h,l,c,f,d,p,x,g){var M=h-i,w=l-n,S=M*M+w*w;if(S>4*e&&x--){var v=s+f,y=o+d,T=u+p,B=xe(v*v+y*y+T*T),P=Me(T/=B),_=I(I(T)-1)<U||I(a-c)<U?(a+c)/2:Te(y,v),N=r(_,P),b=N[0],Y=N[1],L=b-i,R=Y-n,m=w*L-M*R;(m*m/S>e||I((M*L+w*R)/S-.5)>.3||s*f+o*d+u*p<jn)&&(t(i,n,a,s,o,u,b,Y,_,v/=B,y/=B,T,x,g),g.point(b,Y),t(b,Y,_,v,y,T,h,l,c,f,d,p,x,g))}}return function(i){var n,a,s,o,u,h,l,c,f,d,p,x,g={point:M,lineStart:w,lineEnd:v,polygonStart:function(){i.polygonStart(),g.lineStart=y},polygonEnd:function(){i.polygonEnd(),g.lineStart=w}};function M(P,_){P=r(P,_),i.point(P[0],P[1])}function w(){c=NaN,g.point=S,i.lineStart()}function S(P,_){var N=Ae([P,_]),b=r(P,_);t(c,f,l,d,p,x,c=b[0],f=b[1],l=P,d=N[0],p=N[1],x=N[2],Di,i),i.point(c,f)}function v(){g.point=M,i.lineEnd()}function y(){w(),g.point=T,g.lineEnd=B}function T(P,_){S(n=P,_),a=c,s=f,o=d,u=p,h=x,g.point=S}function B(){t(c,f,l,d,p,x,a,s,n,o,u,h,Di,i),g.lineEnd=v,v()}return g}}var qn=ei({point:function(r,e){this.stream.point(r*D,e*D)}});function Zn(r){return ei({point:function(e,t){var i=r(e,t);return this.stream.point(i[0],i[1])}})}function Jn(r,e,t,i,n){function a(s,o){return s*=i,o*=n,[e+r*s,t-r*o]}return a.invert=function(s,o){return[(s-e)/r*i,(t-o)/r*n]},a}function Ri(r,e,t,i,n,a){if(!a)return Jn(r,e,t,i,n);var s=z(a),o=A(a),u=s*r,h=o*r,l=s/r,c=o/r,f=(o*t-s*e)/r,d=(o*e+s*t)/r;function p(x,g){return x*=i,g*=n,[u*x-h*g+e,t-h*x-u*g]}return p.invert=function(x,g){return[i*(l*x-c*g+f),n*(d-c*x-l*g)]},p}function Kn(r){return es(function(){return r})()}function es(r){var e,t=150,i=480,n=250,a=0,s=0,o=0,u=0,h=0,l,c=0,f=1,d=1,p=null,x=yi,g=null,M,w,S,v=Gt,y=.5,T,B,P,_,N;function b(m){return P(m[0]*D,m[1]*D)}function Y(m){return m=P.invert(m[0],m[1]),m&&[m[0]*W,m[1]*W]}b.stream=function(m){return _&&N===m?_:_=qn(Zn(l)(x(T(v(N=m)))))},b.preclip=function(m){return arguments.length?(x=m,p=void 0,R()):x},b.postclip=function(m){return arguments.length?(v=m,g=M=w=S=null,R()):v},b.clipAngle=function(m){return arguments.length?(x=+m?_n(p=m*D):(p=null,yi),R()):p*W},b.clipExtent=function(m){return arguments.length?(v=m==null?(g=M=w=S=null,Gt):An(g=+m[0][0],M=+m[0][1],w=+m[1][0],S=+m[1][1]),R()):g==null?null:[[g,M],[w,S]]},b.scale=function(m){return arguments.length?(t=+m,L()):t},b.translate=function(m){return arguments.length?(i=+m[0],n=+m[1],L()):[i,n]},b.center=function(m){return arguments.length?(a=m[0]%360*D,s=m[1]%360*D,L()):[a*W,s*W]},b.rotate=function(m){return arguments.length?(o=m[0]%360*D,u=m[1]%360*D,h=m.length>2?m[2]%360*D:0,L()):[o*W,u*W,h*W]},b.angle=function(m){return arguments.length?(c=m%360*D,L()):c*W},b.reflectX=function(m){return arguments.length?(f=m?-1:1,L()):f<0},b.reflectY=function(m){return arguments.length?(d=m?-1:1,L()):d<0},b.precision=function(m){return arguments.length?(T=Bi(B,y=m*m),R()):xe(y)},b.fitExtent=function(m,E){return mr(b,m,E)},b.fitSize=function(m,E){return Wn(b,m,E)},b.fitWidth=function(m,E){return $n(b,m,E)},b.fitHeight=function(m,E){return Qn(b,m,E)};function L(){var m=Ri(t,0,0,f,d,c).apply(null,e(a,s)),E=Ri(t,i-m[0],n-m[1],f,d,c);return l=er(o,u,h),B=Ft(e,E),P=Ft(l,B),T=Bi(B,y),R()}function R(){return _=N=null,b}return function(){return e=r.apply(this,arguments),b.invert=e.invert&&Y,L()}}function ii(r,e){return[r,un(fn((q+e)/2))]}ii.invert=function(r,e){return[r,2*qi(cn(e))-q]};function ts(){return is(ii).scale(961/K)}function is(r){var e=Kn(r),t=e.center,i=e.scale,n=e.translate,a=e.clipExtent,s=null,o,u,h;e.scale=function(c){return arguments.length?(i(c),l()):i()},e.translate=function(c){return arguments.length?(n(c),l()):n()},e.center=function(c){return arguments.length?(t(c),l()):t()},e.clipExtent=function(c){return arguments.length?(c==null?s=o=u=h=null:(s=+c[0][0],o=+c[0][1],u=+c[1][0],h=+c[1][1]),l()):s==null?null:[[s,o],[u,h]]};function l(){var c=C*i(),f=e(wn(e.rotate()).invert([0,0]));return a(s==null?[[f[0]-c,f[1]-c],[f[0]+c,f[1]+c]]:r===ii?[[Math.max(f[0]-c,s),o],[Math.min(f[0]+c,u),h]]:[[s,Math.max(f[1]-c,o)],[u,Math.min(f[1]+c,h)]])}return l()}const Ui=new Jt,qe=new F;class gr extends Br{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new Ge(e,3)),this.setAttribute("uv",new Ge(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new zt(t,6,1);return this.setAttribute("instanceStart",new Ce(i,3,0)),this.setAttribute("instanceEnd",new Ce(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new zt(t,6,1);return this.setAttribute("instanceColorStart",new Ce(i,3,0)),this.setAttribute("instanceColorEnd",new Ce(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new Rr(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jt);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Ui.setFromBufferAttribute(t),this.boundingBox.union(Ui))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hi),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let a=0,s=e.count;a<s;a++)qe.fromBufferAttribute(e,a),n=Math.max(n,i.distanceToSquared(qe)),qe.fromBufferAttribute(t,a),n=Math.max(n,i.distanceToSquared(qe));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}et.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new O(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};tt.line={uniforms:ze.merge([et.common,et.fog,et.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				// get the offset direction as perpendicular to the view vector
				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 offset;
				if ( position.y < 0.5 ) {

					offset = normalize( cross( start.xyz, worldDir ) );

				} else {

					offset = normalize( cross( end.xyz, worldDir ) );

				}

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// extend the line bounds to encompass  endcaps
					start.xyz += - worldDir * linewidth * 0.5;
					end.xyz += worldDir * linewidth * 0.5;

					// shift the position of the quad so it hugs the forward edge of the line
					offset.xy -= dir * forwardOffset;
					offset.z += 0.5;

				#endif

				// endcaps
				if ( position.y > 1.0 || position.y < 0.0 ) {

					offset.xy += dir * 2.0 * forwardOffset;

				}

				// adjust for linewidth
				offset *= linewidth * 0.5;

				// set the world position
				worldPos = ( position.y < 0.5 ) ? start : end;
				worldPos.xyz += offset;

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class ri extends Z{constructor(e){super({type:"LineMaterial",uniforms:ze.clone(tt.line.uniforms),vertexShader:tt.line.vertexShader,fragmentShader:tt.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}}const Oi=new F,Ni=new F,G=new yt,H=new yt,ae=new yt,Pt=new F,_t=new Vi,V=new Ur,Ii=new F,Ze=new Jt,Je=new Hi,oe=new yt;let fe,ye;function Li(r,e,t){return oe.set(0,0,-e,1).applyMatrix4(r.projectionMatrix),oe.multiplyScalar(1/oe.w),oe.x=ye/t.width,oe.y=ye/t.height,oe.applyMatrix4(r.projectionMatrixInverse),oe.multiplyScalar(1/oe.w),Math.abs(Math.max(oe.x,oe.y))}function rs(r,e){const t=r.matrixWorld,i=r.geometry,n=i.attributes.instanceStart,a=i.attributes.instanceEnd,s=Math.min(i.instanceCount,n.count);for(let o=0,u=s;o<u;o++){V.start.fromBufferAttribute(n,o),V.end.fromBufferAttribute(a,o),V.applyMatrix4(t);const h=new F,l=new F;fe.distanceSqToSegment(V.start,V.end,l,h),l.distanceTo(h)<ye*.5&&e.push({point:l,pointOnLine:h,distance:fe.origin.distanceTo(l),object:r,face:null,faceIndex:o,uv:null,uv1:null})}}function ns(r,e,t){const i=e.projectionMatrix,a=r.material.resolution,s=r.matrixWorld,o=r.geometry,u=o.attributes.instanceStart,h=o.attributes.instanceEnd,l=Math.min(o.instanceCount,u.count),c=-e.near;fe.at(1,ae),ae.w=1,ae.applyMatrix4(e.matrixWorldInverse),ae.applyMatrix4(i),ae.multiplyScalar(1/ae.w),ae.x*=a.x/2,ae.y*=a.y/2,ae.z=0,Pt.copy(ae),_t.multiplyMatrices(e.matrixWorldInverse,s);for(let f=0,d=l;f<d;f++){if(G.fromBufferAttribute(u,f),H.fromBufferAttribute(h,f),G.w=1,H.w=1,G.applyMatrix4(_t),H.applyMatrix4(_t),G.z>c&&H.z>c)continue;if(G.z>c){const S=G.z-H.z,v=(G.z-c)/S;G.lerp(H,v)}else if(H.z>c){const S=H.z-G.z,v=(H.z-c)/S;H.lerp(G,v)}G.applyMatrix4(i),H.applyMatrix4(i),G.multiplyScalar(1/G.w),H.multiplyScalar(1/H.w),G.x*=a.x/2,G.y*=a.y/2,H.x*=a.x/2,H.y*=a.y/2,V.start.copy(G),V.start.z=0,V.end.copy(H),V.end.z=0;const x=V.closestPointToPointParameter(Pt,!0);V.at(x,Ii);const g=Or.lerp(G.z,H.z,x),M=g>=-1&&g<=1,w=Pt.distanceTo(Ii)<ye*.5;if(M&&w){V.start.fromBufferAttribute(u,f),V.end.fromBufferAttribute(h,f),V.start.applyMatrix4(s),V.end.applyMatrix4(s);const S=new F,v=new F;fe.distanceSqToSegment(V.start,V.end,v,S),t.push({point:v,pointOnLine:S,distance:fe.origin.distanceTo(v),object:r,face:null,faceIndex:f,uv:null,uv1:null})}}}class ss extends _e{constructor(e=new gr,t=new ri({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let s=0,o=0,u=t.count;s<u;s++,o+=2)Oi.fromBufferAttribute(t,s),Ni.fromBufferAttribute(i,s),n[o]=o===0?0:n[o-1],n[o+1]=n[o]+Oi.distanceTo(Ni);const a=new zt(n,2,1);return e.setAttribute("instanceDistanceStart",new Ce(a,1,0)),e.setAttribute("instanceDistanceEnd",new Ce(a,1,1)),this}raycast(e,t){const i=this.material.worldUnits,n=e.camera;n===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const a=e.params.Line2!==void 0&&e.params.Line2.threshold||0;fe=e.ray;const s=this.matrixWorld,o=this.geometry,u=this.material;ye=u.linewidth+a,o.boundingSphere===null&&o.computeBoundingSphere(),Je.copy(o.boundingSphere).applyMatrix4(s);let h;if(i)h=ye*.5;else{const c=Math.max(n.near,Je.distanceToPoint(fe.origin));h=Li(n,c,u.resolution)}if(Je.radius+=h,fe.intersectsSphere(Je)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Ze.copy(o.boundingBox).applyMatrix4(s);let l;if(i)l=ye*.5;else{const c=Math.max(n.near,Ze.distanceToPoint(fe.origin));l=Li(n,c,u.resolution)}Ze.expandByScalar(l),fe.intersectsBox(Ze)!==!1&&(i?rs(this,t):ns(this,n,t))}}class vr extends gr{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e){const t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setColors(i),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class as extends ss{constructor(e=new vr,t=new ri({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}class os extends Wi{constructor(e,t={}){const i=t.font;if(i===void 0)super();else{const n=i.generateShapes(e,t.size);t.depth=t.height!==void 0?t.height:50,t.bevelThickness===void 0&&(t.bevelThickness=10),t.bevelSize===void 0&&(t.bevelSize=8),t.bevelEnabled===void 0&&(t.bevelEnabled=!1),super(n,t)}this.type="TextGeometry"}}const Fi=r=>new Promise((e,t)=>{const i=document.createElement("script");i.src=r,i.type="text/javascript",document.body.appendChild(i),i.onload=e,i.onerror=t});class ls{constructor(e){this.code=e}async getMapJSON(){const{subJson:e,parentJson:t}=await this.mapGet();return{subJson:e,parentJson:t}}mapGet(){const{fetchGeo:e}=this;return new Promise((t,i)=>{try{window.AMapUI?e.call(this,t,i):Promise.all([Fi("https://webapi.amap.com/maps?v=1.4.6&key=09fd0fc2b19bb12146f7b4e056982974&plugin=AMap.Geocoder&callback=onMapLoad")]).then(n=>{window.onMapLoad=e.bind(this,t,i)})}catch(n){i(n)}})}fetchGeo(e,t){Fi("https://webapi.amap.com/ui/1.0/main.js").then(i=>{AMapUI.loadUI(["geo/DistrictExplorer"],n=>{new n().loadAreaNode(this.code,(s,o)=>{if(s)return this.$message({message:`无法加载区域地图资源，联系管理员：${s}`,type:"warning"}),t(s);const u={type:"FeatureCollection",features:o.getSubFeatures()},h={type:"FeatureCollection",features:[o.getParentFeature()]};return e({subJson:u,parentJson:h})})})})}}const cs=`#include <common> 
                            varying vec3 model_world;`,us=`
#include <begin_vertex>
model_world = position;`,hs=`  #include <common>
varying vec3 model_world;
uniform float uTime;
uniform float depth;

float rand(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
  float fl = floor(p);
  float fc = fract(p);
  return mix(rand(fl), rand(fl + 1.), fc);
}`,fs=`
#include <opaque_fragment>
              float noiseOffset = clamp(noise(model_world.x * 100. + uTime * 8.), 0., 1.);
              float strength = smoothstep(1., 0., (model_world.z) / (depth + 0.2)) * noiseOffset * 3.;
              gl_FragColor = vec4(gl_FragColor.xyz, strength);
`,ds=`#include <common> 
varying vec2 vUv;`,ps=`
#include <begin_vertex>
vUv = uv;`,ms=`  
        #include <common>
        float random (vec2 st) {
            return fract(sin(dot(st.xy, vec2(565656.233,123123.2033))) * 323434.34344);
        }

        vec2 random2( vec2 p ) {
            return fract(sin(vec2(dot(p,vec2(234234.1,54544.7)), sin(dot(p,vec2(33332.5,18563.3))))) * 323434.34344);
        }
        uniform float iTime;
        varying vec2 vUv;
        uniform sampler2D iTexture; 
`,gs=`
        #include <opaque_fragment>
        vec2 uv = vUv;
        uv *= 10.0;
        vec2 ipos = floor(uv);  // get the integer coords
        vec2 fpos = fract(uv);  // get the fractional coords

        float brightness = 0.8; // 亮度
        float size = 0.2; // 大小
        float fliterSize = 0.1; // 过滤大小
        float quantities = 0.4; // 数量
        float speed = .2; // 移动速度

        vec3 color = texture2D(iTexture, vUv).rgb; // 初始化材质颜色

        // Assign a random value based on the integer coord
        vec2 targetPoint = random2(ipos + vec2(13.0, 17.0));
        targetPoint = 0.5 + quantities *sin(iTime*speed + 6.2831*targetPoint);

        float dist = length(fpos - targetPoint) * size; 

        float starSize = mix(fliterSize, 1.0, random(ipos)); // 通过随机函数再此随机控制星星大小

        color += (1. - step(0.013 * starSize, dist)) * brightness;
        // gl_FragColor = vec4(color, 1.);
        gl_FragColor = vec4(gl_FragColor.xyz+color,1.0);
`;class vs{constructor(e){this.experience=new se,this.scene=this.experience.scene,this.time=this.experience.time,this.camera=this.experience.camera.instance,this.sizes=this.experience.sizes,this.resources=this.experience.resources,this.jsonHelper=new ls(e.adcode),this.scale=e.scale||.1,this.map=new ie,this.map.name="Map3D",this.map3DConfig=e,this.resources.on("ready",()=>{this.mapGenerator(e.series)})}async mapGenerator(e){if(!Array.isArray(e))return console.error("mapConfig series is not Array");const t=await this.jsonHelper.getMapJSON();let{center:i,scale:n}=this.createCenter(t.parentJson);n*=this.scale,this.projection=ts().center(i).scale(n).translate([0,0]),e.forEach(a=>{a.show&&this.createMap(t[a.mapType],a)})}createMap(e,t){const{lineConfig:i,extrudeFacesConfig:n,crossSectionConfig:a,textConfig:s}=t,o=new ie;o.name=t.name;const{material:u,material1:h,textMaterial:l,lineMaterial:c,texture:f}=this.createMaterial(a,n,s,i);e.features.forEach(d=>{const p=new ie,x=new ie,g=new ie,M=new ie;M.name=d.properties.name,p.name="region",x.name="lineRegion",g.name="textRegion";const{coordinates:w}=d.geometry;if(w.forEach(S=>{S.forEach(v=>{if(t.mapShow){const y=this.createMapPolygon(d,f,t,v,n,u,h);p.add(y)}if(t.lineShow){const y=this.createLine(v,i,c);x.add(y)}})}),p.properties=d.properties,x.properties=d.properties,t.textShow){let{x:S=0,y:v=0,z:y=0}=s.rotation||{};if(s.textType==="dom"){const T=this.createParticles(d,i);T.rotation.set(S,v,y),g.add(T)}else if(s.textType==="canvas"){const T=this.createCanvasText(d,s,i);T.rotation.set(S,v,y),g.add(T)}else{const T=this.createText(i,s,d,l);T.rotation.set(S,v,y),g.add(T)}}M.add(p),M.add(x),M.add(g),o.add(M)}),this.map.add(o),this.scene.add(this.map),console.log(o,12321321)}createCenter(e){const i=Vn().bounds(e),n=i[1][0]-i[0][0],a=i[1][1]-i[0][1],s=this.sizes.width/n,o=this.sizes.height/a;let u=Math.min(s,o);return{center:Sn(e),scale:u}}createMaterial(e,t,i,n){const a=this.resources.items.bgTexture;a.repeat.set(2,2),a.wrapS=ai,a.wrapT=ai,a.encoding=rt;const s=new Nr({shininess:200,color:e.color,transparent:e.transparent,map:a});s.color.convertSRGBToLinear();const o=new Ir({metalness:t.metalness,roughness:t.roughness,color:t.color,transparent:t.transparent}),u=new He({wireframe:!1,color:i.textStyle.color}),h=new ri({color:n.color,linewidth:n.linewidth});return{texture:a,material:s,material1:o,textMaterial:u,lineMaterial:h}}createMapPolygon(e,t,i,n,a,s,o){const u=new Lr;for(let c=0;c<n.length;c++){let[f,d]=this.projection(n[c]);c===0&&u.moveTo(f,-d),u.lineTo(f,-d)}const h=new Wi(u,a.extrudeSettings);i.shader&&(this.crossSectionUniforms={iTime:{value:0},iTexture:{value:t}},this.setCrossSectionMaterial(s),this.customUniforms={uTime:{value:0},depth:{value:a.extrudeSettings.depth}},this.setMaterial(o));const l=new _e(h,[s,o]);return l.name=e.properties.name,l}createLine(e,t,i){const n=new vr,a=[];for(let s=0;s<e.length;s++){let[o,u]=this.projection(e[s]);a.push(new F(o,-u,t.depth))}return n.setPositions(a.map(({x:s,y:o,z:u})=>[s,o,u]).flat()),new as(n,i)}createParticles(e,t){const{center:i}=this.createCenter(e);let[n,a]=this.projection(i);const s=new $i,o=[n,-a,t.depth+.1];s.setAttribute("position",new Ge([0,0,0],3));const u=new Fr({color:"#000",size:.02,sizeattenuation:!0});u.transparent=!0,u.depthWrite=!1;const h=new kr(s,u);return h.position.fromArray(o),h}createText(e,t,i,n){const a=t.filterList.includes(i.properties.name)?t.filterStyle.fontSize:t.textStyle.fontSize,s=t.filterList.includes(i.properties.name)?this.verticalText(t.filterStyle.arrangement,i.properties.name):this.verticalText(t.textStyle.arrangement,i.properties.name),{center:o}=this.createCenter(i);let[u,h]=this.projection(o);const l=new os(s,{font:this.resources.items.fontLang,size:a,height:.002,curveSegments:12,bevelEnabled:!1,bevelThickness:0,bevelSize:0,bevelOffset:0,bevelSegments:0}),c=new _e(l,n);c.name="text",c.geometry.computeBoundingBox();const f=c.geometry.boundingBox,d=f.max.x-f.min.x,p=f.max.y-f.min.y;this.depth=e.depth;let x=u-d/2,g=-h-p/2+.02;return t.filterList.includes(i.properties.name)&&(g+=.05),c.position.set(x,g,e.depth),c}createCanvasText(e,t,i){const n=t.filterList.includes(e.properties.name),a=e.properties.name,s=document.createElement("canvas");s.style.imageRendering="optimizeSpeed";const o=s.getContext("2d");o.imageSmoothingEnabled=!0,o.imageSmoothingQuality="high";const u=3.5,h=n?t.filterStyle:t.textStyle,l=`${h.bold?"bold ":""}${h.fontSize*u}px ${h.fontFamily}`;let c=0,f=0;for(let S=0;S<a.length;S++){const v=a.charAt(S);o.font=l;const y=o.measureText(v).width;c+=y}h.arrangement==="horizontal"?(f=h.lineHeight*u,this.drawTextHorizontally(s,o,h,a,u,l,c,f)):(c=h.fontSize*u,f=a.length*h.lineHeight*u,this.drawTextVertically(s,o,h,a,u,l,c,f));const d=new Qi(s);d.needsUpdate=!0,d.colorSpace=Gi,d.magFilter=d.minFilter=Gr;const p=new He({map:d,transparent:!0});p.onBeforeCompile=S=>{S.fragmentShader=S.fragmentShader.replace("#include <opaque_fragment>",`
            #include <opaque_fragment>
            if(gl_FragColor.a <.8){discard;}
            `)};const x=new _e(new ji(c*8e-4,f*8e-4,1,1),p),{center:g}=this.createCenter(e);let[M,w]=this.projection(g);return x.position.set(M,-w,i.depth),x.name=a,x}getProjection(){return new Promise((e,t)=>{const i=()=>{this.projection?e(this.projection):setTimeout(i,100)};i()})}setMaterial(e){e.onBeforeCompile=t=>{t.uniforms.uTime=this.customUniforms.uTime,t.uniforms.depth=this.customUniforms.depth,t.vertexShader=t.vertexShader.replace("#include <common>",cs),t.vertexShader=t.vertexShader.replace("#include <begin_vertex>",us),t.fragmentShader=t.fragmentShader.replace("#include <common>",hs),t.fragmentShader=t.fragmentShader.replace("#include <opaque_fragment>",fs)}}setCrossSectionMaterial(e){e.onBeforeCompile=t=>{t.uniforms.iTime=this.crossSectionUniforms.iTime,t.vertexShader=t.vertexShader.replace("#include <common>",ds),t.vertexShader=t.vertexShader.replace("#include <begin_vertex>",ps),t.fragmentShader=t.fragmentShader.replace("#include <common>",ms),t.fragmentShader=t.fragmentShader.replace("#include <opaque_fragment>",gs)}}verticalText(e,t){if(t.length){if(e==="horizontal")return t;for(var i="",n=0;n<t.length;n++)i+=t[n]+`
`;return i}}drawTextHorizontally(e,t,i,n,a,s,o,u){e.setAttribute("width",`${o}`),e.setAttribute("height",`${u}`),t.font=s,t.fillStyle=i.color,t.imageSmoothingEnabled=!0,t.fillText(n,0,i.fontSize*a)}drawTextVertically(e,t,i,n,a,s,o,u){e.setAttribute("width",`${o}`),e.setAttribute("height",`${u}`);for(let h=0;h<n.length;h++)t.font=s,t.fillStyle=i.color,t.imageSmoothingEnabled=!0,t.fillText(n[h],0,(+i.fontSize+h*i.lineHeight)*a)}computedTextPosition(){var i;const e=[],t=[];(i=this.map)==null||i.children.map(n=>{n.name==="区域地图"&&(n==null||n.children.map(a=>{a==null||a.children.map(s=>{s.name==="textRegion"&&e.push(s.children[0])})}))}),e.forEach(n=>{n.updateMatrixWorld();const s=n.getWorldPosition(new F).clone().project(this.camera),o=this.sizes.width/2,u=this.sizes.height/2,h=new O((s.x+1)*o,(-s.y+1)*u);t.push({name:n.mapText,x:h.x,y:h.y})}),console.log(t)}update(){this.customUniforms&&this.customUniforms.uTime&&(this.customUniforms.uTime.value=this.time.elapsedTime*.5),this.crossSectionUniforms&&this.crossSectionUniforms.iTime&&(this.crossSectionUniforms.iTime.value=this.time.elapsedTime)}}class xs{constructor(e){this.experience=new se,this.resources=this.experience.resources,this.time=this.experience.time,this.floorGroup=new ie,this.resources.on("ready",()=>{this.initFloor(e)})}initFloor(e){e.series.forEach((t,i)=>{if(t.show){const n=this.resources.items[t.map],a=new He({map:n,color:"#fff",transparent:!0});a.opacity=t.opacity;const s=new _e(new ji(t.size,t.size,1,1),a);s.position.z=+t.depth-i*.01,s.size=t.size,s.speed=t.speed,s.mapName=t.map,this.floorGroup.add(s)}}),this.experience.scene.add(this.floorGroup)}update(){const e=this.floorGroup.children||[];e&&e.forEach(t=>{if(t.mapName==="focusMoveBgTexture"){const i=this.time.elapsedTime%(t.size*2)*t.speed;t.scale.set(i,i,i)}else t.rotation.z=-this.time.elapsedTime*t.speed})}}class Ss{constructor(){this.experience=new se,this.scene=this.experience.scene,this.camera=this.experience.camera.instance,this.sizes=this.experience.sizes,this.resources=this.experience.resources}createSprite(e){if(!e.length)return console.error("tips: Please use the array type for the data configuration items in spriteConfig.");this.scale=e[0].scaleX,this.spriteGroup=new ie,this.spriteGroup.name="location-tips",this.resources.on("ready",async()=>{var t,i;this.projection=await((i=(t=this.experience.world)==null?void 0:t.map3D)==null?void 0:i.getProjection()),this.projection&&(e.forEach(n=>{const a=this.resources.items[n.texture];a.encoding=rt;const s=new oi({map:a});s.onBeforeCompile=l=>{l.fragmentShader=l.fragmentShader.replace("#include <opaque_fragment>",`
                    #include <opaque_fragment>
                    if(gl_FragColor.a <.8){discard;}
                    `)};const o=new li(s);o.scale.set(n.scaleX,n.scaleY,1);const[u,h]=this.projection([n.longitude,n.latitude]);o.position.set(u,-h,n.z),o.properties=n,this.spriteGroup.add(o)}),this.scene.add(this.spriteGroup))})}createTextSprite(e,t){if(!e.length)return console.error("tips: Please use the array type for the data configuration items in textSprite.");this.textSpriteGroup=new ie,this.textSpriteGroup.name="textSprite";const i=document.createElement("canvas"),n=i.getContext("2d");n.font=t.fontSize+"px Arial",n.fillStyle=t.color;let a=0;e.forEach(s=>{n.font=t.fontSize+"px Arial";const o=n.measureText(s.name).width;a=Math.max(a,o)}),i.width=a,i.height=t.fontSize+6,e.forEach(s=>{n.clearRect(0,0,i.width,i.height),n.fillText(s.name,0,t.fontSize);const o=new Qi(i);o.needsUpdate=!0;const u=new oi({map:o}),h=new li(u);h.scale.set(.17,.17,1),h.position.set(s.x,s.y,s.z),h.properties=s,this.textSpriteGroup.add(h)}),this.scene.add(this.textSpriteGroup)}computedSpritePosition(){const e=this.spriteGroup.children,t=[];e.forEach(i=>{if(i.properties.separately){const a=i.getWorldPosition(new F).clone().project(this.camera),s=this.sizes.width/2,o=this.sizes.height/2,u=new O((a.x+1)*s,(-a.y+1)*o),h=this.experience.raycaster.tooltipConfig.type||"Medium",l={"Extra-Large":320,Large:240,Medium:160};t.push({...i.properties,x:u.x-l[h]/2,y:u.y-70})}})}}class ws{constructor(e,t){this.experience=new se,this.scene=this.experience.scene,e.mapConfig.show&&(this.map3D=new vs(e.mapConfig),this.map3D.map.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),this.map3D.map.position.set(e.position.x,e.position.y,e.position.z)),t&&(this.sprite=new Ss,this.sprite.createSprite(t),this.sprite.type=e.spriteConfig.type||"blue",this.sprite.spriteGroup.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),this.sprite.spriteGroup.position.set(e.position.x,e.position.y,e.position.z)),e.hasOwnProperty("floorConfig")&&e.floorConfig.show&&(this.floor=new xs(e.floorConfig),this.floor.floorGroup.rotation.set(e.rotation.x,e.rotation.y,e.rotation.z),this.floor.floorGroup.position.set(e.position.x,e.position.y,e.position.z))}update(){var e,t,i;(e=this.map3D)==null||e.update(),this.map3D.computedTextPosition(),(t=this.floor)==null||t.update(),(i=this.sprite)==null||i.computedSpritePosition()}}const ni={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Re{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ys=new Hr(-1,1,1,-1,0,1);class Ts extends $i{constructor(){super(),this.setAttribute("position",new Ge([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ge([0,2,0,0,2,0],2))}}const Ms=new Ts;class si{constructor(e){this._mesh=new _e(Ms,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ys)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class wt extends Re{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Z?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ze.clone(e.uniforms),this.material=new Z({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new si(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class ki extends Re{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const n=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let s,o;this.inverse?(s=0,o=1):(s=1,o=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),a.buffers.stencil.setFunc(n.ALWAYS,s,4294967295),a.buffers.stencil.setClear(o),a.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(n.EQUAL,1,4294967295),a.buffers.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),a.buffers.stencil.setLocked(!0)}}class bs extends Re{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Zt{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new O);this._width=i.width,this._height=i.height,t=new te(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:le}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new wt(ni),this.copyPass.material.blending=At,this.clock=new Vr}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let n=0,a=this.passes.length;n<a;n++){const s=this.passes[n];if(s.enabled!==!1){if(s.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(n),s.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),s.needsSwap){if(i){const o=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}ki!==void 0&&(s instanceof ki?i=!0:s instanceof bs&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new O);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,n=this._height*this._pixelRatio;this.renderTarget1.setSize(i,n),this.renderTarget2.setSize(i,n);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(i,n)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class xr extends Re{constructor(e,t,i=null,n=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=n,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ce}render(e,t,i){const n=e.autoClear;e.autoClear=!1;let a,s;this.overrideMaterial!==null&&(s=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor)),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=s),e.autoClear=n}}const Es={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ce(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Be extends Re{constructor(e,t,i,n){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=n,this.resolution=e!==void 0?new O(e.x,e.y):new O(256,256),this.clearColor=new ce(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new te(a,s,{type:le}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let c=0;c<this.nMips;c++){const f=new te(a,s,{type:le});f.texture.name="UnrealBloomPass.h"+c,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const d=new te(a,s,{type:le});d.texture.name="UnrealBloomPass.v"+c,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),a=Math.round(a/2),s=Math.round(s/2)}const o=Es;this.highPassUniforms=ze.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=n,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Z({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];a=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let c=0;c<this.nMips;c++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[c])),this.separableBlurMaterials[c].uniforms.invSize.value=new O(1/a,1/s),a=Math.round(a/2),s=Math.round(s/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const l=ni;this.copyUniforms=ze.clone(l.uniforms),this.blendMaterial=new Z({uniforms:this.copyUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader,blending:Yi,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ce,this.oldClearAlpha=1,this.basic=new He,this.fsQuad=new si(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),n=Math.round(t/2);this.renderTargetBright.setSize(i,n);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(i,n),this.renderTargetsVertical[a].setSize(i,n),this.separableBlurMaterials[a].uniforms.invSize.value=new O(1/i,1/n),i=Math.round(i/2),n=Math.round(n/2)}render(e,t,i,n,a){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this.fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[u].uniforms.direction.value=Be.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=Be.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[u];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=s}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new Z({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new O(.5,.5)},direction:{value:new O(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new Z({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Be.BlurDirectionX=new O(1,0);Be.BlurDirectionY=new O(0,1);const Cs=`
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`,Ps=`
uniform sampler2D baseTexture; // 基础纹理
          uniform sampler2D bloomTexture; // 辉光纹理，存储了辉光效果的颜色信息
          varying vec2 vUv;

          void main() {
            // 从基础纹理和辉光纹理中获取颜色值，并相加
            // texture2D函数用于从纹理中获取对应纹理坐标的颜色值。
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
          }
`;class _s{constructor(){Tt(this,"darkenNonBloomed",e=>{e.isMesh&&this.bloomLayer.test(e.layers)===!1&&(this.materials[e.uuid]=e.material,e.material=this.darkMaterial)});Tt(this,"restoreMaterial",e=>{this.materials[e.uuid]&&(e.material=this.materials[e.uuid],delete this.materials[e.uuid])});this.experience=new se,this.scene=this.experience.scene,this.camera=this.experience.camera.instance,this.renderer=this.experience.renderer.instance;const e=1;this.bloomLayer=new Wr,this.bloomLayer.set(e),this.materials={},this.darkMaterial=new He({color:"black"}),this.createPass()}createPass(){const e=new xr(this.scene,this.camera);this.bloomComposer=new Zt(this.renderer),this.bloomComposer.renderToScreen=!1,this.bloomComposer.addPass(e),this.finalComposer=new Zt(this.renderer),this.finalComposer.addPass(e);const t=new Be(new O(this.renderer.domElement.offsetWidth,this.renderer.domElement.offsetHeight),.8,.5,.5);this.bloomComposer.addPass(t);const i=new wt(new Z({uniforms:{baseTexture:{value:null},bloomTexture:{value:this.bloomComposer.renderTarget2.texture}},vertexShader:Cs,fragmentShader:Ps,defines:{}}),"baseTexture");i.needsSwap=!0,this.finalComposer.addPass(i)}update(){this.scene.traverse(this.darkenNonBloomed),this.bloomComposer.render(),this.scene.traverse(this.restoreMaterial),this.finalComposer.render()}}class zs{constructor(e){var t,i;this.experience=new se,this.scene=this.experience.scene,this.canvas=experience.canvas,this.sizes=this.experience.sizes,this.time=this.experience.time,this.mouse=this.experience.mousemove.mouse,this.mouseOffset=this.experience.mousemove.eventOffset,this.camera=this.experience.camera.instance,this.distance=this.experience.camera.distance,this.resources=this.experience.resources,this.raycaster=new $r,this.spriteShow=!0,this.spriteType=((t=this.experience.world.sprite)==null?void 0:t.type)||"blue",this.experience.world.sprite?(this.spriteGroup=(i=this.experience.world.sprite.spriteGroup)==null?void 0:i.children,this.scale=this.experience.world.sprite.scale,this.currentSprite=null,this.currentDistance=0):(this.spriteShow=!1,console.error("tips: Coordinate sprite is not initialized.")),this.objectsToMap=this.experience.world.map3D.map.children,this.currentIntersect=null,this.animation=!0,this.tooltipShow=e.show,this.tooltipConfig=e,this.index=0,this.tooltipIndex=0,this.tooltipTimer=0,this.tooltipTimer2=0}update(){this.raycaster.setFromCamera(this.mouse,this.camera),this.tooltipShow&&this.dispatchHoverAction(),this.spriteShow&&this.locationController()}dispatchHoverAction(){var i;if(!this.spriteShow||!this.spriteGroup.length)return;const e=this.raycaster.intersectObjects(this.spriteGroup,!0),t=document.getElementById("three_tooltip");if(t)if(!e.length)this.index||(t.style.display="none"),this.index=1,this.animation=!0,this.tooltipTimer2+=this.time.delta,this.tooltipTimer2>=2e3&&this.dispatchAction(this.tooltipIndex);else{this.index=0,this.animation=!1,this.tooltipTimer2=0,t.style.display="block";const n=1/+localStorage.getItem("scale")||1;t.style.left=this.mouseOffset.x*n+20+"px",t.style.top=this.mouseOffset.y*n+20+"px",(i=this.currentSprite)==null||i.scale.set(this.scale,this.scale,1),this.currentSprite=e[0].object,this.currentSprite.scale.set(this.scale*1.5,this.scale*1.5,1)}}dispatchAction(e){var t;if(this.animation&&this.spriteShow&&this.tooltipShow&&this.tooltipConfig.animation){if(this.tooltipTimer+=this.time.delta,this.tooltipTimer>=this.tooltipConfig.duration&&(this.tooltipIndex++,this.tooltipTimer=0),!this.animation||!this.spriteGroup.length)return;const i=this.spriteGroup.length,a=this.spriteGroup[e%i].getWorldPosition(new F).clone().project(this.camera),s=this.sizes.width/2,o=this.sizes.height/2,u=Number(this.tooltipConfig.offsetX)||0,h=Number(this.tooltipConfig.offsetY)||0;let l=0,c=0;const f=new O((a.x+1)*s,(-a.y+1)*o),d={"Extra-Large":320,Large:240,Medium:160},p=document.getElementById("three_tooltip");if(p&&f){if(p.style.display="block",f.x>s)l=Number(f.x.toFixed(0))+u||0,c=Number(f.y.toFixed(0))-h;else{const x=d[this.tooltipConfig.type]||160;l=Number(f.x.toFixed(0))-u-x||0,c=Number(f.y.toFixed(0))-h}if(p.style.left=l+"px",p.style.top=c+"px",this.currentSprite&&(this.currentSprite.renderOrder=1),(t=this.currentSprite)==null||t.scale.set(this.scale,this.scale,1),this.spriteType&&this.spriteType!=="random"&&this.currentSprite){const x=this.resources.items[this.spriteType];x&&x.hasOwnProperty("encoding")&&(x.encoding=rt),this.currentSprite.material.map=x,this.currentSprite.material.needsUpdate=!0}if(this.currentSprite=this.spriteGroup[e%i],this.spriteType&&this.spriteType!=="random"&&this.currentSprite){const x=this.resources.items.locationTextureRed;x&&x.hasOwnProperty("encoding")&&(x.encoding=rt),this.currentSprite.material.map=x,this.currentSprite.material.needsUpdate=!0}this.currentSprite.renderOrder=10,this.currentSprite.scale.set(this.scale*2,this.scale*2,1)}else p.style.display="none"}}dispatchRegionAction(){var e;if(this.objectsToMap[1]){const t=this.raycaster.intersectObjects(this.objectsToMap[1].children,!0);t.length?this.objectsToMap[1].children.forEach(i=>{var n,a;i.name===((n=t[0])==null?void 0:n.object.name)&&((a=this.currentIntersect)==null||a.children.forEach(s=>{s.name==="textRegion"?s.children.forEach(o=>{o.position.z=this.experience.world.map3D.depth}):s.children.forEach(o=>{o.scale.set(1,1,1)})}),this.currentIntersect=i,i.children.forEach(s=>{s.name==="textRegion"?s.children.forEach(o=>{o.position.z=this.experience.world.map3D.depth*2}):s.children.forEach(o=>{o.scale.set(1,1,2)})}))}):((e=this.currentIntersect)==null||e.children.forEach(i=>{i.name==="textRegion"?i.children.forEach(n=>{n.position.z=this.experience.world.map3D.depth}):i.children.forEach(n=>{n.scale.set(1,1,1)})}),this.currentIntersect=null)}}locationController(){var s,o;let e=((s=this.currentSprite)==null?void 0:s.name)||"",t=((o=this.currentSprite)==null?void 0:o.id)||"";const i=2.2,n=this.experience.world.sprite.scale,a=this.experience.camera.controls.getDistance();a!==this.currentDistance&&(this.currentDistance=a,this.scale=(n/(i/a)).toFixed(2),this.spriteGroup.forEach(u=>{u.name&&u.name===e||u.id&&u.id===t||u.scale.set(this.scale,this.scale,1)}))}}class ve extends Re{constructor(e,t,i,n){super(),this.renderScene=t,this.renderCamera=i,this.selectedObjects=n!==void 0?n:[],this.visibleEdgeColor=new ce(1,1,1),this.hiddenEdgeColor=new ce(.1,.04,.02),this.edgeGlow=0,this.usePatternTexture=!1,this.edgeThickness=1,this.edgeStrength=3,this.downSampleRatio=2,this.pulsePeriod=0,this._visibilityCache=new Map,this.resolution=e!==void 0?new O(e.x,e.y):new O(256,256);const a=Math.round(this.resolution.x/this.downSampleRatio),s=Math.round(this.resolution.y/this.downSampleRatio);this.renderTargetMaskBuffer=new te(this.resolution.x,this.resolution.y),this.renderTargetMaskBuffer.texture.name="OutlinePass.mask",this.renderTargetMaskBuffer.texture.generateMipmaps=!1,this.depthMaterial=new Qr,this.depthMaterial.side=ci,this.depthMaterial.depthPacking=jr,this.depthMaterial.blending=At,this.prepareMaskMaterial=this.getPrepareMaskMaterial(),this.prepareMaskMaterial.side=ci,this.prepareMaskMaterial.fragmentShader=l(this.prepareMaskMaterial.fragmentShader,this.renderCamera),this.renderTargetDepthBuffer=new te(this.resolution.x,this.resolution.y,{type:le}),this.renderTargetDepthBuffer.texture.name="OutlinePass.depth",this.renderTargetDepthBuffer.texture.generateMipmaps=!1,this.renderTargetMaskDownSampleBuffer=new te(a,s,{type:le}),this.renderTargetMaskDownSampleBuffer.texture.name="OutlinePass.depthDownSample",this.renderTargetMaskDownSampleBuffer.texture.generateMipmaps=!1,this.renderTargetBlurBuffer1=new te(a,s,{type:le}),this.renderTargetBlurBuffer1.texture.name="OutlinePass.blur1",this.renderTargetBlurBuffer1.texture.generateMipmaps=!1,this.renderTargetBlurBuffer2=new te(Math.round(a/2),Math.round(s/2),{type:le}),this.renderTargetBlurBuffer2.texture.name="OutlinePass.blur2",this.renderTargetBlurBuffer2.texture.generateMipmaps=!1,this.edgeDetectionMaterial=this.getEdgeDetectionMaterial(),this.renderTargetEdgeBuffer1=new te(a,s,{type:le}),this.renderTargetEdgeBuffer1.texture.name="OutlinePass.edge1",this.renderTargetEdgeBuffer1.texture.generateMipmaps=!1,this.renderTargetEdgeBuffer2=new te(Math.round(a/2),Math.round(s/2),{type:le}),this.renderTargetEdgeBuffer2.texture.name="OutlinePass.edge2",this.renderTargetEdgeBuffer2.texture.generateMipmaps=!1;const o=4,u=4;this.separableBlurMaterial1=this.getSeperableBlurMaterial(o),this.separableBlurMaterial1.uniforms.texSize.value.set(a,s),this.separableBlurMaterial1.uniforms.kernelRadius.value=1,this.separableBlurMaterial2=this.getSeperableBlurMaterial(u),this.separableBlurMaterial2.uniforms.texSize.value.set(Math.round(a/2),Math.round(s/2)),this.separableBlurMaterial2.uniforms.kernelRadius.value=u,this.overlayMaterial=this.getOverlayMaterial();const h=ni;this.copyUniforms=ze.clone(h.uniforms),this.materialCopy=new Z({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:At,depthTest:!1,depthWrite:!1}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ce,this.oldClearAlpha=1,this.fsQuad=new si(null),this.tempPulseColor1=new ce,this.tempPulseColor2=new ce,this.textureMatrix=new Vi;function l(c,f){const d=f.isPerspectiveCamera?"perspective":"orthographic";return c.replace(/DEPTH_TO_VIEW_Z/g,d+"DepthToViewZ")}}dispose(){this.renderTargetMaskBuffer.dispose(),this.renderTargetDepthBuffer.dispose(),this.renderTargetMaskDownSampleBuffer.dispose(),this.renderTargetBlurBuffer1.dispose(),this.renderTargetBlurBuffer2.dispose(),this.renderTargetEdgeBuffer1.dispose(),this.renderTargetEdgeBuffer2.dispose(),this.depthMaterial.dispose(),this.prepareMaskMaterial.dispose(),this.edgeDetectionMaterial.dispose(),this.separableBlurMaterial1.dispose(),this.separableBlurMaterial2.dispose(),this.overlayMaterial.dispose(),this.materialCopy.dispose(),this.fsQuad.dispose()}setSize(e,t){this.renderTargetMaskBuffer.setSize(e,t),this.renderTargetDepthBuffer.setSize(e,t);let i=Math.round(e/this.downSampleRatio),n=Math.round(t/this.downSampleRatio);this.renderTargetMaskDownSampleBuffer.setSize(i,n),this.renderTargetBlurBuffer1.setSize(i,n),this.renderTargetEdgeBuffer1.setSize(i,n),this.separableBlurMaterial1.uniforms.texSize.value.set(i,n),i=Math.round(i/2),n=Math.round(n/2),this.renderTargetBlurBuffer2.setSize(i,n),this.renderTargetEdgeBuffer2.setSize(i,n),this.separableBlurMaterial2.uniforms.texSize.value.set(i,n)}changeVisibilityOfSelectedObjects(e){const t=this._visibilityCache;function i(n){n.isMesh&&(e===!0?n.visible=t.get(n):(t.set(n,n.visible),n.visible=e))}for(let n=0;n<this.selectedObjects.length;n++)this.selectedObjects[n].traverse(i)}changeVisibilityOfNonSelectedObjects(e){const t=this._visibilityCache,i=[];function n(s){s.isMesh&&i.push(s)}for(let s=0;s<this.selectedObjects.length;s++)this.selectedObjects[s].traverse(n);function a(s){if(s.isMesh||s.isSprite){let o=!1;for(let u=0;u<i.length;u++)if(i[u].id===s.id){o=!0;break}if(o===!1){const u=s.visible;(e===!1||t.get(s)===!0)&&(s.visible=e),t.set(s,u)}}else(s.isPoints||s.isLine)&&(e===!0?s.visible=t.get(s):(t.set(s,s.visible),s.visible=e))}this.renderScene.traverse(a)}updateTextureMatrix(){this.textureMatrix.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),this.textureMatrix.multiply(this.renderCamera.projectionMatrix),this.textureMatrix.multiply(this.renderCamera.matrixWorldInverse)}render(e,t,i,n,a){if(this.selectedObjects.length>0){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,a&&e.state.buffers.stencil.setTest(!1),e.setClearColor(16777215,1),this.changeVisibilityOfSelectedObjects(!1);const o=this.renderScene.background;if(this.renderScene.background=null,this.renderScene.overrideMaterial=this.depthMaterial,e.setRenderTarget(this.renderTargetDepthBuffer),e.clear(),e.render(this.renderScene,this.renderCamera),this.changeVisibilityOfSelectedObjects(!0),this._visibilityCache.clear(),this.updateTextureMatrix(),this.changeVisibilityOfNonSelectedObjects(!1),this.renderScene.overrideMaterial=this.prepareMaskMaterial,this.prepareMaskMaterial.uniforms.cameraNearFar.value.set(this.renderCamera.near,this.renderCamera.far),this.prepareMaskMaterial.uniforms.depthTexture.value=this.renderTargetDepthBuffer.texture,this.prepareMaskMaterial.uniforms.textureMatrix.value=this.textureMatrix,e.setRenderTarget(this.renderTargetMaskBuffer),e.clear(),e.render(this.renderScene,this.renderCamera),this.renderScene.overrideMaterial=null,this.changeVisibilityOfNonSelectedObjects(!0),this._visibilityCache.clear(),this.renderScene.background=o,this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetMaskBuffer.texture,e.setRenderTarget(this.renderTargetMaskDownSampleBuffer),e.clear(),this.fsQuad.render(e),this.tempPulseColor1.copy(this.visibleEdgeColor),this.tempPulseColor2.copy(this.hiddenEdgeColor),this.pulsePeriod>0){const u=.625+Math.cos(performance.now()*.01/this.pulsePeriod)*.75/2;this.tempPulseColor1.multiplyScalar(u),this.tempPulseColor2.multiplyScalar(u)}this.fsQuad.material=this.edgeDetectionMaterial,this.edgeDetectionMaterial.uniforms.maskTexture.value=this.renderTargetMaskDownSampleBuffer.texture,this.edgeDetectionMaterial.uniforms.texSize.value.set(this.renderTargetMaskDownSampleBuffer.width,this.renderTargetMaskDownSampleBuffer.height),this.edgeDetectionMaterial.uniforms.visibleEdgeColor.value=this.tempPulseColor1,this.edgeDetectionMaterial.uniforms.hiddenEdgeColor.value=this.tempPulseColor2,e.setRenderTarget(this.renderTargetEdgeBuffer1),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.separableBlurMaterial1,this.separableBlurMaterial1.uniforms.colorTexture.value=this.renderTargetEdgeBuffer1.texture,this.separableBlurMaterial1.uniforms.direction.value=ve.BlurDirectionX,this.separableBlurMaterial1.uniforms.kernelRadius.value=this.edgeThickness,e.setRenderTarget(this.renderTargetBlurBuffer1),e.clear(),this.fsQuad.render(e),this.separableBlurMaterial1.uniforms.colorTexture.value=this.renderTargetBlurBuffer1.texture,this.separableBlurMaterial1.uniforms.direction.value=ve.BlurDirectionY,e.setRenderTarget(this.renderTargetEdgeBuffer1),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.separableBlurMaterial2,this.separableBlurMaterial2.uniforms.colorTexture.value=this.renderTargetEdgeBuffer1.texture,this.separableBlurMaterial2.uniforms.direction.value=ve.BlurDirectionX,e.setRenderTarget(this.renderTargetBlurBuffer2),e.clear(),this.fsQuad.render(e),this.separableBlurMaterial2.uniforms.colorTexture.value=this.renderTargetBlurBuffer2.texture,this.separableBlurMaterial2.uniforms.direction.value=ve.BlurDirectionY,e.setRenderTarget(this.renderTargetEdgeBuffer2),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.overlayMaterial,this.overlayMaterial.uniforms.maskTexture.value=this.renderTargetMaskBuffer.texture,this.overlayMaterial.uniforms.edgeTexture1.value=this.renderTargetEdgeBuffer1.texture,this.overlayMaterial.uniforms.edgeTexture2.value=this.renderTargetEdgeBuffer2.texture,this.overlayMaterial.uniforms.patternTexture.value=this.patternTexture,this.overlayMaterial.uniforms.edgeStrength.value=this.edgeStrength,this.overlayMaterial.uniforms.edgeGlow.value=this.edgeGlow,this.overlayMaterial.uniforms.usePatternTexture.value=this.usePatternTexture,a&&e.state.buffers.stencil.setTest(!0),e.setRenderTarget(i),this.fsQuad.render(e),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=s}this.renderToScreen&&(this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=i.texture,e.setRenderTarget(null),this.fsQuad.render(e))}getPrepareMaskMaterial(){return new Z({uniforms:{depthTexture:{value:null},cameraNearFar:{value:new O(.5,.5)},textureMatrix:{value:null}},vertexShader:`#include <morphtarget_pars_vertex>
				#include <skinning_pars_vertex>

				varying vec4 projTexCoord;
				varying vec4 vPosition;
				uniform mat4 textureMatrix;

				void main() {

					#include <skinbase_vertex>
					#include <begin_vertex>
					#include <morphtarget_vertex>
					#include <skinning_vertex>
					#include <project_vertex>

					vPosition = mvPosition;

					vec4 worldPosition = vec4( transformed, 1.0 );

					#ifdef USE_INSTANCING

						worldPosition = instanceMatrix * worldPosition;

					#endif
					
					worldPosition = modelMatrix * worldPosition;

					projTexCoord = textureMatrix * worldPosition;

				}`,fragmentShader:`#include <packing>
				varying vec4 vPosition;
				varying vec4 projTexCoord;
				uniform sampler2D depthTexture;
				uniform vec2 cameraNearFar;

				void main() {

					float depth = unpackRGBAToDepth(texture2DProj( depthTexture, projTexCoord ));
					float viewZ = - DEPTH_TO_VIEW_Z( depth, cameraNearFar.x, cameraNearFar.y );
					float depthTest = (-vPosition.z > viewZ) ? 1.0 : 0.0;
					gl_FragColor = vec4(0.0, depthTest, 1.0, 1.0);

				}`})}getEdgeDetectionMaterial(){return new Z({uniforms:{maskTexture:{value:null},texSize:{value:new O(.5,.5)},visibleEdgeColor:{value:new F(1,1,1)},hiddenEdgeColor:{value:new F(1,1,1)}},vertexShader:`varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;

				uniform sampler2D maskTexture;
				uniform vec2 texSize;
				uniform vec3 visibleEdgeColor;
				uniform vec3 hiddenEdgeColor;

				void main() {
					vec2 invSize = 1.0 / texSize;
					vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);
					vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);
					vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);
					vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);
					vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);
					float diff1 = (c1.r - c2.r)*0.5;
					float diff2 = (c3.r - c4.r)*0.5;
					float d = length( vec2(diff1, diff2) );
					float a1 = min(c1.g, c2.g);
					float a2 = min(c3.g, c4.g);
					float visibilityFactor = min(a1, a2);
					vec3 edgeColor = 1.0 - visibilityFactor > 0.001 ? visibleEdgeColor : hiddenEdgeColor;
					gl_FragColor = vec4(edgeColor, 1.0) * vec4(d);
				}`})}getSeperableBlurMaterial(e){return new Z({defines:{MAX_RADIUS:e},uniforms:{colorTexture:{value:null},texSize:{value:new O(.5,.5)},direction:{value:new O(.5,.5)},kernelRadius:{value:1}},vertexShader:`varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;
				uniform float kernelRadius;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}

				void main() {
					vec2 invSize = 1.0 / texSize;
					float sigma = kernelRadius/2.0;
					float weightSum = gaussianPdf(0.0, sigma);
					vec4 diffuseSum = texture2D( colorTexture, vUv) * weightSum;
					vec2 delta = direction * invSize * kernelRadius/float(MAX_RADIUS);
					vec2 uvOffset = delta;
					for( int i = 1; i <= MAX_RADIUS; i ++ ) {
						float x = kernelRadius * float(i) / float(MAX_RADIUS);
						float w = gaussianPdf(x, sigma);
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset);
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset);
						diffuseSum += ((sample1 + sample2) * w);
						weightSum += (2.0 * w);
						uvOffset += delta;
					}
					gl_FragColor = diffuseSum/weightSum;
				}`})}getOverlayMaterial(){return new Z({uniforms:{maskTexture:{value:null},edgeTexture1:{value:null},edgeTexture2:{value:null},patternTexture:{value:null},edgeStrength:{value:1},edgeGlow:{value:1},usePatternTexture:{value:0}},vertexShader:`varying vec2 vUv;

				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;

				uniform sampler2D maskTexture;
				uniform sampler2D edgeTexture1;
				uniform sampler2D edgeTexture2;
				uniform sampler2D patternTexture;
				uniform float edgeStrength;
				uniform float edgeGlow;
				uniform bool usePatternTexture;

				void main() {
					vec4 edgeValue1 = texture2D(edgeTexture1, vUv);
					vec4 edgeValue2 = texture2D(edgeTexture2, vUv);
					vec4 maskColor = texture2D(maskTexture, vUv);
					vec4 patternColor = texture2D(patternTexture, 6.0 * vUv);
					float visibilityFactor = 1.0 - maskColor.g > 0.0 ? 1.0 : 0.5;
					vec4 edgeValue = edgeValue1 + edgeValue2 * edgeGlow;
					vec4 finalColor = edgeStrength * maskColor.r * edgeValue;
					if(usePatternTexture)
						finalColor += + visibilityFactor * (1.0 - maskColor.r) * (1.0 - patternColor.r);
					gl_FragColor = finalColor;
				}`,blending:Yi,depthTest:!1,depthWrite:!1,transparent:!0})}}ve.BlurDirectionX=new O(1,0);ve.BlurDirectionY=new O(0,1);const As={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new O(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	precision highp float;

	uniform sampler2D tDiffuse;

	uniform vec2 resolution;

	varying vec2 vUv;

	// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)

	//----------------------------------------------------------------------------------
	// File:        es3-keplerFXAAassetsshaders/FXAA_DefaultES.frag
	// SDK Version: v3.00
	// Email:       gameworks@nvidia.com
	// Site:        http://developer.nvidia.com/
	//
	// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
	//
	// Redistribution and use in source and binary forms, with or without
	// modification, are permitted provided that the following conditions
	// are met:
	//  * Redistributions of source code must retain the above copyright
	//    notice, this list of conditions and the following disclaimer.
	//  * Redistributions in binary form must reproduce the above copyright
	//    notice, this list of conditions and the following disclaimer in the
	//    documentation and/or other materials provided with the distribution.
	//  * Neither the name of NVIDIA CORPORATION nor the names of its
	//    contributors may be used to endorse or promote products derived
	//    from this software without specific prior written permission.
	//
	// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
	// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
	// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	//
	//----------------------------------------------------------------------------------

	#ifndef FXAA_DISCARD
			//
			// Only valid for PC OpenGL currently.
			// Probably will not work when FXAA_GREEN_AS_LUMA = 1.
			//
			// 1 = Use discard on pixels which don't need AA.
			//     For APIs which enable concurrent TEX+ROP from same surface.
			// 0 = Return unchanged color on pixels which don't need AA.
			//
			#define FXAA_DISCARD 0
	#endif

	/*--------------------------------------------------------------------------*/
	#define FxaaTexTop(t, p) texture2D(t, p, -100.0)
	#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)
	/*--------------------------------------------------------------------------*/

	#define NUM_SAMPLES 5

	// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
	float contrast( vec4 a, vec4 b ) {
			vec4 diff = abs( a - b );
			return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
	}

	/*============================================================================

									FXAA3 QUALITY - PC

	============================================================================*/

	/*--------------------------------------------------------------------------*/
	vec4 FxaaPixelShader(
			vec2 posM,
			sampler2D tex,
			vec2 fxaaQualityRcpFrame,
			float fxaaQualityEdgeThreshold,
			float fxaaQualityinvEdgeThreshold
	) {
			vec4 rgbaM = FxaaTexTop(tex, posM);
			vec4 rgbaS = FxaaTexOff(tex, posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaE = FxaaTexOff(tex, posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaN = FxaaTexOff(tex, posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
			vec4 rgbaW = FxaaTexOff(tex, posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
			// . S .
			// W M E
			// . N .

			bool earlyExit = max( max( max(
					contrast( rgbaM, rgbaN ),
					contrast( rgbaM, rgbaS ) ),
					contrast( rgbaM, rgbaE ) ),
					contrast( rgbaM, rgbaW ) )
					< fxaaQualityEdgeThreshold;
			// . 0 .
			// 0 0 0
			// . 0 .

			#if (FXAA_DISCARD == 1)
					if(earlyExit) FxaaDiscard;
			#else
					if(earlyExit) return rgbaM;
			#endif

			float contrastN = contrast( rgbaM, rgbaN );
			float contrastS = contrast( rgbaM, rgbaS );
			float contrastE = contrast( rgbaM, rgbaE );
			float contrastW = contrast( rgbaM, rgbaW );

			float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
			relativeVContrast *= fxaaQualityinvEdgeThreshold;

			bool horzSpan = relativeVContrast > 0.;
			// . 1 .
			// 0 0 0
			// . 1 .

			// 45 deg edge detection and corners of objects, aka V/H contrast is too similar
			if( abs( relativeVContrast ) < .3 ) {
					// locate the edge
					vec2 dirToEdge;
					dirToEdge.x = contrastE > contrastW ? 1. : -1.;
					dirToEdge.y = contrastS > contrastN ? 1. : -1.;
					// . 2 .      . 1 .
					// 1 0 2  ~=  0 0 1
					// . 1 .      . 0 .

					// tap 2 pixels and see which ones are "outside" the edge, to
					// determine if the edge is vertical or horizontal

					vec4 rgbaAlongH = FxaaTexOff(tex, posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
					float matchAlongH = contrast( rgbaM, rgbaAlongH );
					// . 1 .
					// 0 0 1
					// . 0 H

					vec4 rgbaAlongV = FxaaTexOff(tex, posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
					float matchAlongV = contrast( rgbaM, rgbaAlongV );
					// V 1 .
					// 0 0 1
					// . 0 .

					relativeVContrast = matchAlongV - matchAlongH;
					relativeVContrast *= fxaaQualityinvEdgeThreshold;

					if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
							// 1 1 .
							// 0 0 1
							// . 0 1

							// do a simple blur
							return mix(
									rgbaM,
									(rgbaN + rgbaS + rgbaE + rgbaW) * .25,
									.4
							);
					}

					horzSpan = relativeVContrast > 0.;
			}

			if(!horzSpan) rgbaN = rgbaW;
			if(!horzSpan) rgbaS = rgbaE;
			// . 0 .      1
			// 1 0 1  ->  0
			// . 0 .      1

			bool pairN = contrast( rgbaM, rgbaN ) > contrast( rgbaM, rgbaS );
			if(!pairN) rgbaN = rgbaS;

			vec2 offNP;
			offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
			offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;

			bool doneN = false;
			bool doneP = false;

			float nDist = 0.;
			float pDist = 0.;

			vec2 posN = posM;
			vec2 posP = posM;

			int iterationsUsed = 0;
			int iterationsUsedN = 0;
			int iterationsUsedP = 0;
			for( int i = 0; i < NUM_SAMPLES; i++ ) {
					iterationsUsed = i;

					float increment = float(i + 1);

					if(!doneN) {
							nDist += increment;
							posN = posM + offNP * nDist;
							vec4 rgbaEndN = FxaaTexTop(tex, posN.xy);
							doneN = contrast( rgbaEndN, rgbaM ) > contrast( rgbaEndN, rgbaN );
							iterationsUsedN = i;
					}

					if(!doneP) {
							pDist += increment;
							posP = posM - offNP * pDist;
							vec4 rgbaEndP = FxaaTexTop(tex, posP.xy);
							doneP = contrast( rgbaEndP, rgbaM ) > contrast( rgbaEndP, rgbaN );
							iterationsUsedP = i;
					}

					if(doneN || doneP) break;
			}


			if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge

			float dist = min(
					doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES - 1 ) : 1.,
					doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES - 1 ) : 1.
			);

			// hacky way of reduces blurriness of mostly diagonal edges
			// but reduces AA quality
			dist = pow(dist, .5);

			dist = 1. - dist;

			return mix(
					rgbaM,
					rgbaN,
					dist * .5
			);
	}

	void main() {
			const float edgeDetectionQuality = .2;
			const float invEdgeDetectionQuality = 1. / edgeDetectionQuality;

			gl_FragColor = FxaaPixelShader(
					vUv,
					tDiffuse,
					resolution,
					edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
					invEdgeDetectionQuality
			);

	}
	`},Ds={name:"GammaCorrectionShader",uniforms:{tDiffuse:{value:null}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 tex = texture2D( tDiffuse, vUv );

			gl_FragColor = sRGBTransferOETF( tex );

		}`};class Bs{constructor(e){this.experience=new se,this.scene=this.experience.scene,this.camera=this.experience.camera.instance,this.sizes=this.experience.sizes,this.renderer=this.experience.renderer.instance,this.createPass(e)}async createPass(e){const t=new te(800,600,{samples:this.renderer.getPixelRatio()===1&&e.antiAliasing?2:0});this.composer=new Zt(this.renderer,t);const i=new xr(this.scene,this.camera);this.composer.addPass(i);const n=new ve(new O(window.innerWidth,window.innerHeight),this.scene,this.camera);this.composer.addPass(n),n.visibleEdgeColor=new ce(10544639),n.edgeStrength=e.edgeStrength,n.edgeGlow=e.edgeGlow,n.edgeThickness=e.edgeThickness,n.pulsePeriod=e.pulsePeriod,await this.experience.world.map3D.getProjection();const a=this.experience.world.map3D.map.children,s=[];if(a[a.length>=e.showIndex?e.showIndex:0].children.forEach(o=>{o.children&&o.children.forEach(u=>{u.name==="region"&&s.push(u.children[0])})}),n.selectedObjects=s,e.gamma){const o=new wt(Ds);this.composer.addPass(o),console.log("Using gamma")}if(e.antiAliasing&&this.renderer.getPixelRatio()===1&&!this.renderer.capabilities.isWebGL2){const o=new wt(As);o.uniforms.resolution.value.set(1/window.innerWidth,1/window.innerHeight),this.composer.addPass(o),console.log("Using FXAA")}}update(){var e;this.composer.setSize((e=this.sizes)==null?void 0:e.width,this.sizes.height),this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio,2)),this.composer.render()}}let Ke=null;class se{constructor(e,t,i=null){if(Ke)return Ke;if(Ke=this,window.experience=this,this.canvas=e,!t)return;const{cameraConfig:n,rendererConfig:a,sources:s,passConfig:o,sizeConfig:u,lightConfig:h,worldConfig:l}=t;switch(this.sizes=new Yr(u),this.time=new Xr,this.scene=new qr,this.resources=new Zr(s),this.mousemove=new nn,this.camera=new an(n),this.light=new sn(h),this.renderer=new on(a),this.world=new ws(l,i),this.passConfig=o,o.type){case"outline":this.outlineEffect=new Bs(o.outlineConfig);break;case"bloom":this.bloomPass=new _s(o.bloomConfig);break}this.raycaster=new zs(l.tooltipConfig),this.sizes.on("resize",()=>{this.resize()}),this.time.on("tick",()=>{this.update()})}resize(){var e,t;(e=this.camera)==null||e.resize(),(t=this.renderer)==null||t.resize()}update(){var e,t,i,n,a,s;switch((e=this.camera)==null||e.update(),(t=this.world)==null||t.update(),this.raycaster.update(),this.passConfig.type){case"outline":(i=this.outlineEffect)==null||i.update();break;case"bloom":(n=this.bloomPass)==null||n.update();break;case"none":(a=this.renderer)==null||a.update();break;default:(s=this.renderer)==null||s.update();break}}clearGroup(e){if(!e.children.length)return;const t=n=>{var a;(a=n.geometry)==null||a.dispose()},i=n=>{let a=n.children.filter(s=>s);a.forEach(s=>{s.children.length?i(s):(t(s),s.clear())}),n.clear(),a=null};i(e)}dispose(){var e,t,i,n,a,s,o,u,h,l;(e=this.sizes)==null||e.off("resize"),(t=this.sizes)==null||t.release(),(i=this.time)==null||i.off("tick"),(n=this.time)==null||n.release(),(a=this.mousemove)==null||a.off("mousemove"),(s=this.mousemove)==null||s.release(),(o=this.scene)==null||o.traverse(c=>{var f;(f=c.geometry)==null||f.dispose(),(c instanceof ie||c instanceof Jr)&&this.clearGroup(c)}),(u=this.scene)==null||u.clear(),(h=this.renderer)==null||h.dispose(),(l=this.camera)==null||l.dispose(),this.sizes=null,this.time=null,this.scene=null,this.resources=null,this.mousemove=null,this.camera=null,this.light=null,this.renderer=null,Ke=null,window.experience=null}}const Rs={el:"pc-three-map3D",icon:"icon-ic_map",adaptation:"pc",useSource:"v10",name:"三维背景地图",type:"chart",rootType:"preset1",fetchOptions:{dataSource:2,orgSource:"v10",sourceInfo:{isClassTarget:0,sourceName:"全部",sourceId:"0"},dateType:0,dimenFormat:"yyyy-MM",pageSize:0,targetDetails:[{targetShowType:"main",targetId:46,title:"在管项目数",type:86,op:"sum",format:{thousandth:!1,decimalPlaces:0,hasUnit:!0,unit:""},hasPercent:!1,growth:"",sectionType:1,visible:!0,key:1700637241778,formula:null,customizable:!1,isClassTarget:0}],dimenDetails:[{dimenId:"org",title:"组织",type:"string",format:0,dimenType:"default",reportType:0,visible:!0,isDataDictionary:!1,customUrl:null,customOptions:null}],filterListV:{},sortBy:{targetId:"",desc:0},currentDate:2023},chartOptions:{chartName:"三维背景地图",worldConfig:{position:{x:-.2,y:0,z:0},rotation:{x:-.5,y:0,z:0},mapConfig:{show:!0,adcode:33e4,scale:.1,series:[{show:!0,mapShow:!1,lineShow:!0,textShow:!1,name:"轮廓地图",mapId:0,mapType:"parentJson",shader:!1,castShadow:!1,receiveShadow:!1,lineConfig:{depth:.111,color:"#A0E5FF",linewidth:.002},textConfig:{textType:"dom",rotation:{x:0,y:0,z:0},textStyle:{arrangement:"horizontal",fontSize:20,color:"#ffffff",bold:!0,lineHeight:20,fontFamily:"Arial"},filterList:["长宁区","静安区","普陀区","徐汇区","黄浦区","虹口区","杨浦区"],filterStyle:{arrangement:"vertical",fontSize:28,color:"#ffffff",bold:!0,lineHeight:20,fontFamily:"Arial"}},extrudeFacesConfig:{color:"#3EB8F3",transparent:!0,metalness:1,roughness:1,extrudeSettings:{depth:.11,bevelEnabled:!1,bevelSegments:1,bevelSize:0,bevelThickness:0}},crossSectionConfig:{transparent:!0,color:"#2B61A6"}},{show:!0,mapShow:!0,lineShow:!0,textShow:!0,name:"区域地图",mapId:1,mapType:"subJson",shader:!0,castShadow:!0,receiveShadow:!0,lineConfig:{depth:.11,color:"#ffffff",linewidth:.001},textConfig:{textType:"dom",rotation:{x:0,y:0,z:0},textStyle:{arrangement:"horizontal",fontSize:18,color:"#ffffff",bold:!0,lineHeight:20,fontFamily:"Arial"},filterList:["长宁区","静安区","普陀区","徐汇区","黄浦区","虹口区","杨浦区"],filterStyle:{arrangement:"vertical",fontSize:28,color:"#ffffff",bold:!0,lineHeight:20,fontFamily:"Arial"}},extrudeFacesConfig:{color:"#3a7abd",transparent:!0,metalness:1,roughness:1,extrudeSettings:{depth:.1,bevelEnabled:!1,bevelSegments:1,bevelSize:0,bevelThickness:0}},crossSectionConfig:{transparent:!0,color:"#2B61A6"}}]},floorConfig:{show:!0,series:[{id:1,name:"光环1",map:"border1Texture",show:!0,speed:1,size:3,depth:0,opacity:.4},{id:2,name:"光环2",map:"border2Texture",show:!0,speed:1,size:3,depth:0,opacity:.4},{id:3,name:"扩散光环",map:"focusMoveBgTexture",show:!0,speed:2,size:2,depth:0,opacity:.7}]},spriteConfig:{scale:.1,height:.16,type:"random"},tooltipConfig:{show:!0,animation:!0,duration:2e3,type:"Medium",offsetX:150,offsetY:150,background:"rgba(0, 0, 0, 0.65)",filterGroupShow:"",filterGroupHide:"",allInfo:[{key:"precinctLocation",targetName:"项目地址",resultValue:"",show:!0},{key:"precinctIntroduction",targetName:"项目简介",resultValue:"",show:!0},{key:"proManager",targetName:"项目经理",resultValue:"",show:!0},{key:"proManagerPhone",targetName:"联系电话",resultValue:"",show:!0}]}},sizeConfig:{type:"parent",id:"_Background_3D"},passConfig:{type:"none",outlineConfig:{edgeStrength:3,edgeGlow:1,edgeThickness:3,pulsePeriod:2,gamma:!0,antiAliasing:!0,showIndex:1},bloomConfig:{strength:.8,raduis:.5,threshold:.5}},rendererConfig:{antialias:!0,alpha:!0,clearAlpha:0,clearColor:""},cameraConfig:{fov:75,near:.1,far:1e3,position:{x:0,y:0,z:1.6},lookAt:!0,controls:{show:!0,enableDamping:!0,minPolarAngle:Math.PI*.25,maxPolarAngle:Math.PI*.75,minAzimuthAngle:-Math.PI*.45,maxAzimuthAngle:Math.PI*.25,enablePan:!1}},lightConfig:[{type:"point",color:"#3e99e5",intensity:3,distance:500,helper:!1,lightId:0,lightName:"光源1",position:{x:-10,y:48,z:50}},{type:"point",color:"#3e99e5",intensity:3,distance:285,helper:!1,lightId:1,lightName:"光源2",position:{x:1,y:-5,z:50}},{type:"point",color:"#3e99e5",intensity:10,distance:285,helper:!1,lightId:2,lightName:"光源3",position:{x:1,y:-28,z:3}}],sources:[{name:"locationTexture",type:"texture",path:"texture/blue-location.png"},{name:"locationTextureGreen",type:"texture",path:"texture/green-location.png"},{name:"locationTextureRed",type:"texture",path:"texture/red-location.png"},{name:"locationTextureYellow",type:"texture",path:"texture/yellow-location.png"},{name:"border1Texture",type:"texture",path:"texture/rotationBorder1.png"},{name:"border2Texture",type:"texture",path:"texture/rotationBorder2.png"},{name:"focusMoveBgTexture",type:"texture",path:"texture/focus_move_bg.png"},{name:"bgTexture",type:"texture",path:"texture/bg.png"},{name:"fontLang",type:"font",path:"font/TsangerYuYangT_W03_Regular.json"}]}};const Us={name:"Map",data(){return{_three_instance:null}},mounted(){var r;(r=this._three_instance)==null||r.dispose(),this._three_instance=new se(this.$refs.webgl,Rs.chartOptions)},beforeDestroy(){var r;(r=this._three_instance)==null||r.dispose()},methods:{}},Os={ref:"box",class:"china-chart",id:"_Background_3D"},Ns={class:"webgl",ref:"webgl",id:"scene"};function Is(r,e,t,i,n,a){return en(),tn("div",Os,[rn("canvas",Ns,null,512)],512)}const Gs=Kr(Us,[["render",Is],["__scopeId","data-v-bc3c5436"]]);export{Gs as default};
