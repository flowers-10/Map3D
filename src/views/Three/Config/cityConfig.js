export const cityConfig = {
    el: 'pc-three-city3D',
    icon: 'icon-ic_city',
    adaptation: 'pc',
    useSource: 'v10', //使用源  v10/v8 ,默认v10
    name: '上海城市风',
    type: 'chart',
    rootType: 'preset2',
    fetchOptions:{},
    chartOptions: {
        camera: {
            fov: 60,
            near: 1,
            far: 10000,
            position: {
                x: 600,
                y: 600,
                z: 600,
            },
            lookAt: true,
        },
        renderer: {
            clearAlpha: 0,
        },
    },
}
