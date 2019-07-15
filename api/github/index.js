const { get, post } = require('../../utils/request')
const Octokit = require('@octokit/rest')
const octokit = new Octokit({
  auth: '9ba8ab216de76e4b96a9b16a6fd65ad14ceb15bc',
  previews: ['mercy-preview'],
})

;(async () => {
  const result = await octokit.activity.listReposStarredByUser({
    username: 'zhixiaoqiang',
  })
  console.warn(result.data)
})()
