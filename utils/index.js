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

module.exports = {
  schedule,
  formatQuery,
}
