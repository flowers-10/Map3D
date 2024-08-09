export const mapVertexCommon  = `#include <common> 
                            varying vec3 model_world;`

export const mapBeginVertex =  `
#include <begin_vertex>
model_world = position;`        
                   