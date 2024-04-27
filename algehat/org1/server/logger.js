import { appendFileSync, openSync } from 'fs'

const _log = console.log
const _err = console.error

console.log = (...args) => {
  args.unshift(getTimeString())
  try {
    const file = openSync('./log.txt', 'a')
    appendFileSync(file, '\n' + getTimeString() + args.join(' '), 'utf8')

  } catch (error) {
    _err(error)
  }
  _log(...args)
}

console.error = (...args) => {
  args.unshift(getTimeString())
  try {
    const file = openSync('./log.txt', 'a')
    appendFileSync(file, args.join(' '), 'utf8')

  } catch (error) {
    _err(error)
  }
  _err(...args)
}

function getTimeString() {
  const d = new Date()
  return `[${d.toString().substring(4, 24)}] `
}