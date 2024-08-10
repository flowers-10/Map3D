float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
}
varying vec3 vPosition;
uniform float height;
uniform vec3 uFlowColor;
uniform vec3 uCityColor;
void main() {
    //模型的基础颜色
    vec3 distColor = uCityColor;
    // 流动范围当前点z的高度加上流动线的高度
    float topY = vPosition.z + 10.;
    if(height > vPosition.z && height < topY) {
        // 颜色渐变
        float dIndex = sin((height - vPosition.z) / 10.0 * 3.14);
        distColor = mix(uFlowColor, distColor, 1.0 - dIndex);
    }
    //定位当前点位位置
    vec2 position2D = vec2(vPosition.x, vPosition.y);
    //求点到原点的距离
    float Len = distanceTo(position2D, vec2(0, 0));
    if(Len > height * 30.0 && Len < (height * 30.0 + 130.0)) {
        // 颜色渐变
        float dIndex = sin((Len - height * 30.0) / 130.0 * 3.14);
        distColor = mix(uFlowColor, distColor, 1.0 - dIndex);
    }
    gl_FragColor = vec4(distColor, 1.0);
}
