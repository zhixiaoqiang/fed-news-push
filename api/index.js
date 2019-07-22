const { get, post } = require('../utils/request')
const dayjs = require('dayjs')
const schedule = require('node-schedule')
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
async function githubList (data) {
  try {
    const result = await post(
      'https://extension-ms.juejin.im/resources/github',
      {
        category: 'trending',
        lang: 'javascript',
        limit: '30',
        offset: 0,
        period: 'month',
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

// ;(async () => {
//   try {
//     const feedCardList = await githubList()
//     const res = await post(
//       'https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=23_DFm0fJD_w2XkFczmrP_tRdMv0rWNWJ1OROlUGq4wHz9Y7us5BGHiZ3cjWOLsve2_O8s0kexhjCpePFPxRfX-sBFkxb7R7LhOZZFNMY06gqU7sFk1fvKN-z7p_ejf5I7-Uh4EhMOrh4FxAu3ZPZCeAAAISV&env=nazi-cloud-430a12&name=actical',
//       {
//         $url: 'insertFedNews',
//         data: {
//           list: feedCardList.data || [],
//           site: 'github',
//         },
//       }
//     )
//     console.warn(res)
//   } catch (error) {
//     console.warn(error)
//   }
// })()

module.exports = {
  isHoliday,
  githubList,
  schedule,
}
