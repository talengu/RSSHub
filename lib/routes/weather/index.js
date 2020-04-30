const got = require('@/utils/got');
// 在这个确定省份。AJS 江苏  四川 ASC
// http://www.nmc.cn/f/rest/province
// 确定 city code 58269
// http://www.nmc.cn/f/rest/province/AJS
// 测试：http://localhost:1200/weather/58269
module.exports = async (ctx) => {
    const city_id = ctx.params.city_id || '58269';
    const api_url = `http://www.nmc.cn/f/rest/predict/${city_id}`;
    const response = await got({
        method: 'get',
        url: api_url,
    });
    const data = response.data;
    const station = data.station;
    const pubTime = data.publish_time;
    const detail = data.detail;
    function getweekday(date) {
        const weekArray = new Array('日', '一', '二', '三', '四', '五', '六');
        const week = weekArray[new Date(date).getDay()]; // 注意此处必须是先new一个Date
        return date + '周' + week + ' ';
    }
    function getdesci(item) {
        const dw = item.day.weather;
        // info img temperature
        const nw = item.night.weather;
        return dw.info + ' ' + dw.temperature + '度 - ' + nw.info + ' ' + nw.temperature + '度';
    }

    const base_url = 'http://www.nmc.cn';

    ctx.state.data = {
        title: station.city + '天气-中央气象台',
        link: base_url + station.url,
        item: detail.slice(0, 3).map((item) => ({
            title: getweekday(item.date) + getdesci(item),
            link: base_url + station.url,
            pubDate: new Date(pubTime).toUTCString(),
        })),
    };
};
