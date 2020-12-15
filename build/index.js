// https://cli.vuejs.org/zh/guide/build-targets.html
const { run } = require('tasksfile')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

run(`vue-cli-service build ${args}`)
