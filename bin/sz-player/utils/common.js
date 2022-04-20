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

// 数组随机排序
export function randomShuffle(arr) {
    let length = arr.length;
    if (!Array.isArray(arr) || length <= 1) return;
    for(let index = 0;i < length - 1; index ++) {
        let randomIdx = Math.floor(Math.random()*(length - index)) + index;
        [arr[index],arr[randomIdx]] = [arr[randomIdx],arr[index]];
    }
}