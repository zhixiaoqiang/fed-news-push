const schedule = require('node-schedule')
const Api = require('./api')
const wxClounFun = require('./api/wxClounFun')
const dingTalk = require('./api/dingTalk')
const githubApi = require('./api/github')
const { getJunJinList } = require('./api/juejin')
const { post, get } = require('./utils/request')

const launch = async () => {
  // const rule = new schedule.RecurrenceRule()
  // rule.second = [0, 10, 20, 30, 40, 50] // 每隔 10 秒执行一次

  schedule.scheduleJob('0 0 6 * * *', async () => {
    // 每天六点开始爬取数据
    try {
      const feedCardList = await Api.githubTrendingList()
      await wxClounFun.insertFedNews(feedCardList.data || [], 'github')
      console.warn('数据插入成功')
    } catch (error) {
      console.warn(error)
    }
  })

  schedule.scheduleJob('0 10 6 * * *', async () => {
    // 每天六点开始爬取数据
    try {
      const juejinList = await Api.jueJinFedList({ limit: 100 })
      await wxClounFun.insertFedNews(juejinList.data || [], 'junjin')
      console.warn('数据插入成功')
    } catch (error) {
      console.warn(error)
    }
  })

  schedule.scheduleJob('0 0 10 * * *', async () => {
    // 每天十点执行推送任务，当天为工作日时才能真正推送
    try {
      const isHoliday = await Api.isHoliday()

      if (!isHoliday) {
        const result = await wxClounFun.getFedNews({
          offset: 0,
          pageSize: 5,
        })

        await githubApi.createIssues({
          owner: 'zhixiaoqiang',
          repo: 'fed-news-push',
          title: result.title,
          body: result.text,
          labels: ['日报'],
        })

        await wxClounFun.insertFedNewsDay({
          type: 'markdown',
          title: result.title,
          text: result.text,
        })

        await dingTalk.markdown(result)

        // await dingTalk.feedCard(result)
      }
    } catch (error) {
      console.warn(error)
    }
  })
}

// launch()
;(async () => {
  try {
    // 获取数据并插入数据库
    // const trendingList = await Api.githubTrendingList()
    // await wxClounFun.insertFedNews(trendingList.data || [], 'github')
    // const juejinList = await Api.jueJinFedList({ limit: 100 })
    // await wxClounFun.insertFedNews(juejinList.data || [], 'junjin')

    // console.warn('数据插入成功')

    // await getJunJinList()

    const isHoliday = await Api.isHoliday()
    if (!isHoliday) {
      const result = await wxClounFun.getFedNews({
        offset: 0,
        pageSize: 5,
      })
      await githubApi.createIssues({
        owner: 'zhixiaoqiang',
        repo: 'fed-news-push',
        title: result.title,
        body: result.text,
        labels: ['日报'],
      })
      await wxClounFun.insertFedNewsDay({
        type: 'markdown',
        title: result.title,
        text: result.text,
      })
      // todo 添加查看更多
      await dingTalk.markdown({
        title: result.title,
        text: `${
          result.text
        } \n\n #### [查看更多](https://github.com/zhixiaoqiang/fed-news-push/issues)`,
      })
      console.warn(`${result.text} 推送完成`)
      // await dingTalk.feedCard(result)
    }
    // await post('http://localhost:7001/dingTalk/markdown', {
    //   title: '来了老弟',
    //   text: '## 老弟 dingTalk成功迁移到web服务',
    // })
    // await post('http://localhost:7001/github/createIssues', {
    //   owner: 'zhixiaoqiang',
    //   repo: 'fed-news-push',
    //   title: 'createIssues成功迁移web服务',
    //   body: '耶✌️',
    //   labels: ['迁移'],
    // })
    // const res = await post('http://localhost:7001/githubTrendingList')
    // console.warn(res)
  } catch (error) {
    // console.warn(error)
  }
})()
