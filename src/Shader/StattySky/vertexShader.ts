export const skyVertexShader = `
varying vec2 vUv;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vUv = uv;
}
`

export const skyVertexCommon  = `#include <common> 
varying vec2 vUv;`

export const skyBeginVertex =  `
#include <begin_vertex>
vUv = uv;`  