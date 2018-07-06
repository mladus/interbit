const promisify = require('util').promisify
const childProcessExec = require('child_process').exec

const exec = promisify(childProcessExec)
const fs = require('fs-extra')
const path = require('path')
const which = require('which')

const IB_CLI_PKG_NAME = 'interbit'

const getInterbitBinLocation = async () => {
  const interbitBinLocation = which.sync(IB_CLI_PKG_NAME)
  if (!fs.existsSync(interbitBinLocation)) {
    return undefined
  }

  if (interbitBinLocation.endsWith('.CMD')) {
    return interbitBinLocation.substr(0, interbitBinLocation.length - 4)
  }
  return interbitBinLocation
}

const executeInterbitScript = async (script, options) => {
  const interbitBinLocation = await getInterbitBinLocation()
  const command = `${interbitBinLocation} ${script} ${options}`

  await exec(command)
}

const interbitScriptStdoutEvents = (script, options) =>
  childProcessExec(`${script} ${options}`).stdout

module.exports = {
  getInterbitBinLocation,
  interbitScriptStdoutEvents,
  executeInterbitScript
}
