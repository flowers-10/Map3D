export const mapFragmentCommon  = `  #include <common>
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
}`

export const mapOutputFragment =  `
#include <opaque_fragment>
              float noiseOffset = clamp(noise(model_world.x * 100. + uTime * 8.), 0., 1.);
              float strength = smoothstep(1., 0., (model_world.z) / (depth + 0.2)) * noiseOffset * 3.;
              gl_FragColor = vec4(gl_FragColor.xyz, strength);
`        
