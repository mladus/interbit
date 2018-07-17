const promisify = require('util').promisify
const spawn = require('cross-spawn')
const exec = promisify(require('child_process').exec)
const fs = require('fs-extra')
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

  return exec(command)
}

const interbitScriptStdoutEvents = async (script, options) => {
  const interbitBinLocation = await getInterbitBinLocation()
  const process = spawn(interbitBinLocation, [script, ...options.split(' ')])

  process.on('error', console.log)

  return process
}

module.exports = {
  getInterbitBinLocation,
  interbitScriptStdoutEvents,
  executeInterbitScript
}
