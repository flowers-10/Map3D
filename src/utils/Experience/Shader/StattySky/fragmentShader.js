export const skyFragmentShader = `

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(565656.233,123123.2033))) * 323434.34344);
}

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(234234.1,54544.7)), sin(dot(p,vec2(33332.5,18563.3))))) * 323434.34344);
}
uniform float iTime;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform vec3 color1; //渐变1
uniform vec3 color2; //渐变2


void main()
{      
    vec2 uv = vUv;
    uv *= 10.0;
    vec2 ipos = floor(uv);  // get the integer coords
    vec2 fpos = fract(uv);  // get the fractional coords
	
    float brightness = 0.8; // 亮度
    float size = 0.2; // 大小
    float fliterSize = 0.1; // 过滤大小
    float quantities = 0.4; // 数量
    float speed = .2; // 移动速度
    
    vec3 color =mix(color1,color2,-vUv.y);// 初始化颜色
    // vec3 color = texture2D(uTexture, vUv).rgb; // 初始化材质颜色

    // Assign a random value based on the integer coord
    vec2 targetPoint = random2(ipos + vec2(13.0, 17.0));
    targetPoint = 0.5 + quantities *sin(iTime*speed + 6.2831*targetPoint);

    float dist = length(fpos - targetPoint) * size; 

    float starSize = mix(fliterSize, 1.0, random(ipos)); // 通过随机函数再此随机控制星星大小


    color += (1. - step(0.013 * starSize, dist)) * brightness;

    gl_FragColor = vec4(color, 1.);

}
`
