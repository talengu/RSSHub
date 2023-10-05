const got = require('@/utils/got');

// 测试 http://localhost:1200/cctv/mdm
module.exports = async () => {
    const url = 'http://api.cntv.cn/NewVideo/getVideoListByColumn?id=TOPC1451559038345600&n=20&sort=desc&p=1&mode=0&serviceId=tvcctv';
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
        title: '面对面',
        link: 'http://tv.cctv.com/lm/mdm/videoset/index.shtml',
        description:
            '《面对面》是中央电视台的一档长篇人物专访节目，时长45分钟，每周日晚21：30在新闻频道播出。 《面对面》秉持新闻性、权威性、关注度、影响力的诉求，面对面的交流，心与心的碰撞，用对话记录历史，以人物解读新闻。进入《面对面》的人物都是重量级的，他们中有新闻事件中的焦点人物，有新闻话题中的权威人物，有时代变革中的风云人物，有备受关注的公众人物。他们因为非凡的影响力进入了《面对面》，而《面对面》让他们更加具有影响力。 我们共同的理想是：为变幻中国制作一份打开的人物志。所以，我们以更人文的态度关注社会，以更开放的视角关注中国。',
        item: resultItem,
    };
};
