const { post } = require('../utils/request')
const { dingTalkConf } = require('../config')
const { dingtalkUrl } = dingTalkConf

/**
 * 通用钉钉消息接口
 * @param {*} body 任意钉钉格式
 */
async function send (body) {
  try {
    await post(dingtalkUrl, body)
  } catch (error) {
    console.log(error)
  }
}

/**
 * 钉钉文本推送
 * @param {*} params { text, isAtAll, mobile = '15057594294' }
 */
async function text ({ text, isAtAll, mobile = '15057594294' }) {
  const body = {
    msgtype: 'text',
    text: {
      content: `${text} @${mobile}`,
    },
    at: {
      atMobiles: [mobile],
      isAtAll: isAtAll,
    },
  }

  send(body)
}

/**
 * 钉钉链接推送
 * @param {*} params
 */
async function link (params) {
  const body = {
    msgtype: 'link',
    link: params,
  }

  send(body)
}

/**
 * 钉钉markdown推送
 * @param {*} params { title, text, isAtAll, mobile = '15057594294' }
 */
async function markdown ({ title, text, isAtAll, mobile = '15057594294' }) {
  const body = {
    msgtype: 'markdown',
    markdown: {
      title,
      text,
    },
    at: {
      atMobiles: [mobile],
      isAtAll: isAtAll,
    },
  }

  send(body)
}

/**
 * 钉钉actionCard推送
 * @param {*} params
 */
async function actionCard (params) {
  const body = {
    msgtype: 'actionCard',
    actionCard: params,
  }

  send(body)
}

/**
 * 钉钉feedCard推送
 * @param {*} params
 *   [{
        "title": "",
        "messageURL": "",
        "picURL": ""
    }]
 */
async function feedCard (params) {
  const body = {
    msgtype: 'feedCard',
    feedCard: {
      links: params,
    },
  }

  send(body)
}

module.exports = {
  send,
  text,
  link,
  markdown,
  actionCard,
  feedCard,
}
