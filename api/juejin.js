const puppeteer = require('puppeteer-core')
const { post, get } = require('../utils/request')

async function getJunJinList (data) {
  try {
    const result = await post(
      'https://web-api.juejin.im/query',
      {
        operationName: '',
        query: '',
        variables: {
          tags: [],
          category: '5562b415e4b00c57d9b94ac8',
          first: 20,
          after: '',
          order: 'THREE_DAYS_HOTTEST',
        },
        extensions: { query: { id: '653b587c5c7c8a00ddf67fc66f989d42' } },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Agent': 'Juejin/Web',
          'X-Legacy-Device-Id': 1562124411256,
          'X-Legacy-Token':
            'eyJhY2Nlc3NfdG9rZW4iOiJyQ1JYa20yYkx3bkRrcG1KIiwicmVmcmVzaF90b2tlbiI6IlVYenh3VFJZTGJpQUhaZjciLCJ0b2tlbl90eXBlIjoibWFjIiwiZXhwaXJlX2luIjoyNTkyMDAwfQ==',
          'X-Legacy-Uid': '57e8a767bf22ec0058783f3c',
        },
      }
    )
    return result.data.articleFeed.items.edges.map((item) => {
      return {
        ...node,
      }
    })
  } catch (error) {
    console.warn(error)
  }
}

module.exports = {
  getJunJinList,
}
