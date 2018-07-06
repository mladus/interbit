const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')

const assertBuildCorrectness = (artifactsLocation, originalConfig) => {
  assert.ok(fs.existsSync(artifactsLocation))

  const manifest = requireBuiltManifest(artifactsLocation)

  assert.ok(manifest)
  assert.ok(manifest.peers)
  assert.ok(manifest.apps)
  assert.ok(manifest.chains)
  assert.ok(manifest.genesisBlocks)
  assert.ok(manifest.manifest)
  assert.ok(manifest.covenants)

  assert.deepEqual(manifest.peers, originalConfig.peers)

  const configuredApps = Object.keys(originalConfig.apps)
  const builtApps = Object.keys(manifest.apps)
  assert.deepEqual(configuredApps, builtApps, 'Apps configuration')

  // TODO: wait for merge of PR #533
  // const configuredCovenantAliases = Object.keys(originalConfig.covenants)
  // const builtCovenantAliases = Object.keys(manifest.covenants)
  // assert.deepEqual(builtCovenantAliases, [
  //   ...configuredCovenantAliases,
  //   'interbitRoot'
  // ],
  // 'Covenant configuration')

  const configuredChains = Object.keys(originalConfig.staticChains)
  const builtChains = Object.keys(manifest.chains)
  assert.deepEqual(
    builtChains,
    [...configuredChains, 'interbitRoot'],
    'Chains configuration'
  )

  const covenantFilenames = Object.values(manifest.covenants).map(
    covenant => covenant.filename
  )

  for (const covenantFilename of covenantFilenames) {
    const relativeCovenantFilename = path.join(
      __dirname,
      '../',
      artifactsLocation,
      covenantFilename
    )

    assert.ok(
      fs.existsSync(relativeCovenantFilename),
      `${covenantFilename} covenant exists in build`
    )
  }
}

const requireBuiltManifest = artifactsLocation =>
  // eslint-disable-next-line
  require(path.join(
    __dirname,
    '../',
    `${artifactsLocation}`,
    'interbit.manifest.json'
  ))

const outputHasChainIds = output =>
  output.toString().startsWith('Created chain ')
const getChainFromOutput = output => {
  const outputString = output.toString()
  return outputString.replace('Created chain ', '').replace('\n', '')
}

const isOutputDone = output =>
  output.toString().startsWith('Finished updating index.html with chain IDs')

const assertChainCorrectness = async (chain, chainState, manifest) => {
  // check the chain state for...
  // ... correct covenant hash
  // ... correct join config
  // ... correct ACL
  if (chain.chainAlias === 'interbitRoot') {
    // check the root chain for full manifest
    assert.deepEqual(chainState.manifest, manifest)
  } else {
    // TODO: check the child chains for subsets of the manifest
  }
}

module.exports = {
  assertBuildCorrectness,
  requireBuiltManifest,
  outputHasChainIds,
  getChainFromOutput,
  isOutputDone,
  assertChainCorrectness
}
