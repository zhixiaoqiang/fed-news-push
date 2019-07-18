const { schedule } = require('./utils')
const Api = require('./api')
const wxClounFun = require('./api/wxClounFun')
const dingTalk = require('./api/dingTalk')

const launch = async () => {
  // const rule = new schedule.RecurrenceRule()
  // rule.second = [0, 10, 20, 30, 40, 50] // 每隔 10 秒执行一次

  schedule.scheduleJob('0 0 6 * * *', async () => {
    // 每天六点开始爬取数据
    try {
      const feedCardList = await Api.githubList()
      const res = await wxClounFun.insertFedNews(
        feedCardList.data || [],
        'github'
      )
      console.warn(res)
    } catch (error) {
      console.warn(error)
    }
    // console.warn('爬取并插入成功')
  })

  schedule.scheduleJob('0 0 10 * * *', async () => {
    // console.warn('每天十点执行推送任务，当天为工作日时才能真正推送')
    const isHoliday = await Api.isHoliday()
    if (!isHoliday) {
      const feedCardList = await wxClounFun.getFedNews()
      await dingTalk.feedCard(feedCardList)
    }
  })
}

// launch()
;(async () => {
  // 每天六点开始爬取数据
  try {
    // const feedCardList = await Api.githubList()
    // const res = await wxClounFun.insertFedNews(
    //   feedCardList.data || [],
    //   'github'
    // )

    const isHoliday = await Api.isHoliday()

    if (!isHoliday) {
      const result = await wxClounFun.getFedNews({
        offset: 0,
        pageSize: 4,
      })

      await dingTalk.markdown(result)

      // await dingTalk.feedCard(result)
    }
  } catch (error) {
    console.warn(error)
  }
  // console.warn('爬取并插入成功')
})()
