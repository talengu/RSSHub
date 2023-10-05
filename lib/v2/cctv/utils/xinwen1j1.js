const got = require('@/utils/got');

// 测试 http://localhost:1200/cctv/xinwen1j1
module.exports = async () => {
    const url = 'http://api.cntv.cn/NewVideo/getVideoListByColumn?id=TOPC1451559066181661&n=20&sort=desc&p=1&mode=0&serviceId=tvcctv';

    const response = await got({
        method: 'get',
        url: url,
    });

    const data = response.data.data;

    const resultItem = await Promise.all(
        data.list.map(async (video) => {
            const url = `http://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=${video.guid}`;
            const item = {
                title: video.title,
                description: video.brief,
                link: video.url,
                pubDate: new Date(video.time).toUTCString(),
            };
            const { data: videoDetail } = await got({
                method: 'get',
                url: url,
            });

            item.description += `<video src="${videoDetail.hls_url}" controls="controls" poster="${video.image}" style="width: 100%"></video>`;
            return Promise.resolve(item);
        })
    );

    return {
        title: '新闻1+1',
        link: 'http://tv.cctv.com/lm/xinwen1j1/videoset/index.shtml',
        description:
            '从时事政策、公共话题、突发事件等大型选题中选取当天最新、最热、最快的新闻话题,还原新闻全貌、解读事件真相，力求以精度、纯度和锐度为新闻导向，呈现最质朴的新闻。\r\n 首播时间：CCTV新闻 周一至周五 21：30 重播时间：CCTV新闻 次日凌晨01：30',
        item: resultItem,
    };
};
