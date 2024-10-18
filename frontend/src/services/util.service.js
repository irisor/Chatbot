export const utilService = {
    throttle,
    debounce
}

function throttle(func, time) {
    let timeoutId
    return (...args) => {
        if (timeoutId) return
        timeoutId = setTimeout(() => {
            func(...args)
            timeoutId = null
        }, time);
    }
}

function debounce(func, time) {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func(...args)
            timeoutId = null
        }, time);
    }
}

