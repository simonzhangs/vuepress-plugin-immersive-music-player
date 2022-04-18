// 节流函数
export function throttle(func,wait) {
    let timeout = null;
    return function() {
        let context = this;
        let args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args)
            }, wait)
        }
    }
}

// 防抖函数
export function debounce(func, wait) {
    let timeout = null;
    return function() {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() =>{
            func.apply(context,args)
        }, wait);
    }
}

