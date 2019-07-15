const { get, post } = require('./request')
const dayjs = require('dayjs')
const { feedCard } = require('./dingTalk')

async function isHoliday (date = new Date()) {
  try {
    const result = await get('http://api.goseek.cn/Tools/holiday', {
      date: dayjs(date).format('YYYYMMDD'),
    })

    // 正常工作日 0, 法定节假日 1, 节假日调休补班 2，休息日 3
    console.warn(result.data !== 0)
    return result.data !== 0
  } catch (error) {
    console.warn(error)
  }
}

async function githubList (date = new Date()) {
  try {
    const result = await post(
      'https://extension-ms.juejin.im/resources/github',
      {
        category: 'trending',
        lang: 'javascript',
        limit: '10',
        offset: 0,
        period: 'day',
      }
    )

    const feedCardList = result.data.map((item) => {
      const {
        starCount,
        forkCount,
        description,
        detailPageUrl,
        owner: { url },
      } = item
      return {
        title: description,
        messageURL: detailPageUrl,
        picURL: url,
        starCount,
        forkCount,
      }
    })

    return {
      success: true,
      data: feedCardList,
    }
  } catch (error) {
    return {
      success: false,
    }
  }
}

githubList()

module.exports = {
  isHoliday,
  githubList,
}
