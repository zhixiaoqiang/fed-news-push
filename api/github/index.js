const Octokit = require('@octokit/rest')
const { github } = require('../../config/')
const octokit = new Octokit({
  auth: github.auth,
  // previews: ['jean-grey', 'symmetra'],
  baseUrl: 'https://api.github.com',
  log: {
    debug () {},
    info () {},
    warn: console.warn,
    error: console.error,
  },
  request: {
    agent: undefined,
    fetch: undefined,
    timeout: 0,
  },
})

/**
 *
 * @param {*} owner
 * @param {*} repo
 * @param {*} title
 * @param {*} body
 * @param {*} labels
 */
async function createIssues (data) {
  try {
    const result = await octokit.issues.create({
      ...data,
    })

    return result
  } catch (error) {
    console.warn(error)
  }
}

async function listForOrg (data = {}) {
  try {
    const result = await octokit.repos.listForOrg({
      org: 'zhixiaoqiang',
      type: 'public',
      ...data,
    })
    console.warn(result)
    return result
  } catch (error) {
    console.warn(error)
  }
}

module.exports = {
  createIssues,
  listForOrg,
}
