const fse = require('fs-extra')
const { resolve } = require('path')
const dayjs = require('dayjs')
const { post, get } = require('../utils/request')
const { formatQuery, limitText } = require('../utils')
// const { text } = require('./dingTalk')

const CONFIG_URL = resolve(__dirname, '../config/index.json')

const isTokenExpires = (createTime, expires) => {
  const date1 = dayjs(createTime)
  const date2 = dayjs(new Date())

  // expires - 120 留出2分钟时间，防止调用过程中失效了
  return date2.diff(date1, 's') > expires - 120
}

const getAccessToken = async () => {
  const config = await fse.readJson(CONFIG_URL, 'utf8')
  const {
    token,
    createTime,
    expires,
    grant_type,
    appid,
    secret,
  } = config.wxConf
  if (token && !isTokenExpires(createTime, expires)) {
    return token
  }

  try {
    const query = {
      grant_type,
      appid,
      secret,
    }
    const res = await get(`https://api.weixin.qq.com/cgi-bin/token?${formatQuery(query)}`)
    config.wxConf.createTime = dayjs().valueOf()
    config.wxConf.expires = res.expires_in
    config.wxConf.token = res.access_token
    await fse.outputJson(CONFIG_URL, config, {
      spaces: 2,
    })

    return res.access_token
  } catch (error) {
    console.warn(error)
    return false
  }
}

const wxCloudUrl = async (name) => {
  const access_token = await getAccessToken()
  if (access_token) {
    return `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=nazi-cloud-430a12&name=${name}`
  }
}

const insertFedNews = async (list, site) => {
  try {
    const url = await wxCloudUrl('actical')
    const res = await post(url, {
      $url: 'insertFedNews',
      data: {
        list,
        site,
      },
    })
    return res
  } catch (error) {
    console.warn(error)
  }
}

const insertFedNewsDay = async (data) => {
  try {
    const url = await wxCloudUrl('actical')

    const { text, type, title } = data
    const res = await post(url, {
      $url: 'insertFedNewsDay',
      data: {
        createTime: dayjs().format('YYYY-MM-DD'),
        text,
        type,
        title,
      },
    })
    return res
  } catch (error) {
    console.warn(error)
  }
}

const insertFedNewsWeek = async (data) => {
  try {
    const url = await wxCloudUrl('actical')
    const res = await post(url, {
      $url: 'insertFedNewsWeek',
      data: {
        effectDate,
        invaildDate,
        text,
        type,
        title,
      },
    })
    return res
  } catch (error) {
    console.warn(error)
  }
}

const getFedNews = async ({ type = 'markdown', offset = 0, pageSize = 20 }) => {
  try {
    const url = await wxCloudUrl('actical')
    const res = await post(url, {
      $url: 'list',
      data: {
        offset,
        pageSize,
      },
    })

    const fedNews = JSON.parse(res.resp_data).data

    if (type === 'markdown') {
      const markdownText = fedNews
        .map((item) => {
          const {
            title,
            description,
            messageURL,
            username,
            starCount = 0,
            forkCount = 0,
          } = item
          return `### [${username}](https://github.com/${username})/[${title}](${messageURL})\n\n > ${limitText(description)} \n\n **star：${starCount} fork：${forkCount}**`
        })
        .join('\n\n')

      return {
        title: `${dayjs().format('YYYY-MM-DD')}前端资讯日报`,
        text: `## ${dayjs().format('YYYY-MM-DD')}前端资讯日报 \n\n ${markdownText}`,
      }
    }

    if (type === 'feedCard') {
      const feedCardList = fedNews.map((item) => {
        const { description, messageURL, picURL } = item
        return {
          title: description,
          messageURL,
          picURL,
        }
      })
      return feedCardList
    }
  } catch (error) {
    console.warn(error)
  }
}

module.exports = {
  getAccessToken,
  insertFedNews,
  insertFedNewsDay,
  insertFedNewsWeek,
  getFedNews,
}
