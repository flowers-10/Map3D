const IS_IN_SET_LIST = ['cabMT', 'dataScreen', 'cab']

/**
 * 生成资源加载路径
 * @param val
 * 1、http => url
 * 2、data:image/ => base64
 * 3、否则 => 域名 + /api/fastdfs/fastdfs/pictureUrl?fileId=xxx
 * @returns {*}
 */

export const resourcepath = (val, type = 'origin') => {
    const httpStart = val.indexOf('http://') === 0
    const base64Start = val.indexOf('data:image/') === 0

    if (httpStart || base64Start) {
        return val
    } else {
        if (type === 'origin') {
            return `${process.env.BASE_API}/fastdfs/fastdfs/pictureUrl?fileId=${encodeURIComponent(val)}`
        } else {
            return `${process.env.BASE_API}/fastdfs/fastdfs/pictureUrl?fileId=${val}`
        }

        // return `${window.location.protocol}//${window.location.host}/api/fastdfs/fastdfs/pictureUrl?fileId=${val}`;
    }
}

/**
 * @description: 异步加载js资源
 * @param {str} url
 * @return {promise}
 */
export const loadJs = (url) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = url
        script.type = 'text/javascript'
        document.body.appendChild(script)
        script.onload = resolve
        script.onerror = reject
    })
}

/**
 * @description: 异步加载css资源
 * @param {str} url
 * @return {promise}
 */
export const loadCss = (url) => {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        document.head.appendChild(link)
        link.onload = resolve
        link.onerror = reject
    })
}

/**
 * @description: 异步加载js资源
 * @param {str} url
 * @return {promise}
 */
export const loadInJs = (url) => {
    let pathName = location.pathname.includes('ChartsCab')
        ? '/ChartsCab/'
        : IS_IN_SET_LIST.includes(location.pathname.split('/')[1])
        ? '/'
        : location.pathname
    let inUrl = location.origin + pathName + `static/${url}`
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = inUrl
        script.type = 'text/javascript'
        document.body.appendChild(script)
        script.onload = resolve
        script.onerror = reject
    })
}

/**
 * @description: 异步加载css资源
 * @param {str} url
 * @return {promise}
 */
export const loadInCss = (url) => {
    let pathName = location.pathname.includes('ChartsCab')
        ? '/ChartsCab/'
        : IS_IN_SET_LIST.includes(location.pathname.split('/')[1])
        ? '/'
        : location.pathname
    let inUrl = location.origin + pathName + `static/${url}`
    return new Promise((resolve, reject) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = inUrl
        document.head.appendChild(link)
        link.onload = resolve
        link.onerror = reject
    })
}
