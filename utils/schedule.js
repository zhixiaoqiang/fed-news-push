const schedule = require('node-schedule')

const rule = new schedule.RecurrenceRule()
rule.second = [0, 10, 20, 30, 40, 50] // 每隔 10 秒执行一次
schedule.scheduleJob(rule, () => {
  console.log('执行任务')
})

schedule.scheduleJob(rule, () => {
  console.log('执行任务2')
})

schedule.scheduleJob('0 0 9 * * *', () => {
  console.log('执行任务3')
})

const scheduleHandle = (date, cb = () => {}) => {
  schedule.scheduleJob(date, cb)
}

module.exports = {
  scheduleHandle,
}
