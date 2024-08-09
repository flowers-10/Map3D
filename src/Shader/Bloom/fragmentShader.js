export const fragmentShader = `
uniform sampler2D baseTexture; // 基础纹理
          uniform sampler2D bloomTexture; // 辉光纹理，存储了辉光效果的颜色信息
          varying vec2 vUv;

          void main() {
            // 从基础纹理和辉光纹理中获取颜色值，并相加
            // texture2D函数用于从纹理中获取对应纹理坐标的颜色值。
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
          }
`