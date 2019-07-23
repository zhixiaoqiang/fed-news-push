const { get, post } = require('../utils/request')
const dayjs = require('dayjs')
/**
 * 是否假期
 * @param {*} date
 */
async function isHoliday (date = new Date()) {
  try {
    const result = await get('http://api.goseek.cn/Tools/holiday', {
      date: dayjs(date).format('YYYYMMDD'),
    })

    // 正常工作日 0, 法定节假日 1, 节假日调休补班 2，休息日 3
    return result.data !== 0
  } catch (error) {
    console.warn(error)
  }
}

/**
 * github trending list
 * @param {*} data
 */
async function githubTrendingList (data) {
  try {
    const result = await post(
      'https://extension-ms.juejin.im/resources/github',
      {
        category: 'trending',
        lang: 'javascript',
        limit: '30',
        offset: 0,
        period: 'week',
        ...data,
      }
    )

    const feedCardList = result.data.map((item) => {
      const {
        starCount,
        forkCount,
        description,
        detailPageUrl,
        username,
        lang,
        reponame,
        owner: { url },
      } = item
      return {
        title: reponame,
        description,
        messageURL: detailPageUrl,
        picURL: url,
        starCount,
        forkCount,
        username,
        lang,
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

module.exports = {
  isHoliday,
  githubTrendingList,
}
