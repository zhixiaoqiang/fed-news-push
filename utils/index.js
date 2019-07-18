const schedule = require('node-schedule')

const formatQuery = (obj) => {
  const str = []
  for (const k in obj) {
    if (typeof obj[k] !== 'undefined') {
      str.push(`${k}=${encodeURIComponent(obj[k])}`)
    }
  }
  return str.join('&')
}

const limitText = (text = '', limitCount = 120) => {
  return text.length > limitCount ? `${text.slice(0, limitCount)}...` : text
}

module.exports = {
  schedule,
  formatQuery,
  limitText,
}
