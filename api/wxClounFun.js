const fse = require('fs-extra')
const { resolve } = require('path')
const dayjs = require('dayjs')
const { post, get } = require('../utils/request')
const { formatQuery } = require('../utils')
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
    await post(url, {
      $url: 'insertFedNews',
      data: {
        list,
        site,
      },
    })
  } catch (error) {
    console.warn(error)
  }
}

const getFedNews = async (offset = 0, pageSize = 20) => {
  try {
    const url = await wxCloudUrl('actical')
    await post(url, {
      $url: 'list',
      data: {
        offset,
        pageSize,
      },
    })
  } catch (error) {
    console.warn(error)
  }
}

;(async () => {
  // await text({
  //   text: '测试封装函数',
  // })
})()

module.exports = {
  getAccessToken,
  insertFedNews,
  getFedNews,
}
