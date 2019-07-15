const { post } = require('./request')
// const { dingtalkConf } = require('../config')
// const { dingtalkUrl } = dingtalkConf
const dingtalkUrl =
  'https://oapi.dingtalk.com/robot/send?access_token=17951140a6f17d2ee10b0af05affd49a587d060ea693029dd2bcaeb7d1ac53b8'

async function send (body) {
  try {
    await post(dingtalkUrl, body)
  } catch (error) {
    console.log(error)
  }
}

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

  try {
    await post(dingtalkUrl, body)
  } catch (error) {
    console.log(error)
  }
}

async function link (params) {
  const body = {
    msgtype: 'link',
    link: params,
  }

  try {
    await post(dingtalkUrl, body)
  } catch (error) {
    console.log(error)
  }
}

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

  try {
    await post(dingtalkUrl, body)
  } catch (error) {
    console.log(error)
  }
}

async function actionCard (params) {
  const body = {
    msgtype: 'actionCard',
    actionCard: params,
  }

  try {
    await post(dingtalkUrl, body)
  } catch (error) {
    console.log(error)
  }
}

async function feedCard (params) {
  const body = {
    msgtype: 'feedCard',
    feedCard: {
      links: params,
    },
  }

  try {
    await post(dingtalkUrl, body)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  send,
  text,
  link,
  markdown,
  actionCard,
  feedCard,
}
