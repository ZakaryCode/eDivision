const app = {
    // 存储事件监听
    storage: (key, callback = () => {}) => {
        window
            .addEventListener('storage', function (e) {
                //获取被修改的键值
                if (e.key === key) {
                    // 设置回调
                    if (typeof callback === 'function') {
                        callback(e);
                    }
                }
            }, false);
    },
    // 事件监听
    listen: (event, callback = () => {}) => {
        window
            .addEventListener(event, function (e) {
                // 设置回调
                if (typeof callback === 'function') {
                    callback(e);
                }
            }, false);
    },
    formatSearch: (obj) => {
        let s = '?';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                // console.log(s, key, element, JSON.stringify(obj));
                s += key + '=' + element + '&';
            }
        }
        // console.log(s);
        return s.substring(0, s.length - 1);
    },
    formatTime: (data) => {
        const e = new Date(data);
        return e.getFullYear() + "-" + (e.getMonth() + 1) + "-" + e.getDate() + " " + e.getHours() + ":" + e.getMinutes();
    }
};

module.exports = app;
