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

// 当当前时间的秒值为10时执行任务，如：2018-7-8 13:25:10
// schedule.scheduleJob('50 * * * * *', () => {
//   console.log(new Date())
// })
