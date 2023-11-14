let pathName = location.pathname.includes('ChartsCab') ? '/ChartsCab/' : location.pathname
export default [
    {
        name: 'locationTexture',
        type: 'texture',
        path: location.origin + pathName + 'static/image/red-location.png',
    },
    {
        name: 'bgTexture',
        type: 'texture',
        path: location.origin + pathName + 'static/image/bg.png',
    },
]
