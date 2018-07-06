const interbit = require('interbit')
const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')
const {
  getInterbitBinLocation,
  executeInterbitScript,
  interbitScriptStdoutEvents
} = require('../scripts/exec')

describe('run cli', () => {
  describe('helper unit tests', () => {
    it('gets the bin location for interbit-cli', async () => {
      const binLocation = await getInterbitBinLocation()
      console.log(binLocation)
      assert.ok(binLocation)
    })
  })

  describe('start', () => {
    it('runs successfully on a good config', () => {
      // execute start with config
      // make sure nothing bad happened
      // get one of the piped chain IDs and connect
      // check its state
    })
  })

  describe('build', () => {
    beforeEach(() => {
      fs.mkdirpSync('tmp')
    })

    afterEach(() => {
      fs.rmdirSync('tmp')
    })

    const assertBuildCorrectness = (artifactsLocation, originalConfig) => {
      assert.ok(fs.existsSync(artifactsLocation))

      // eslint-disable-next-line
      const manifest = require(path.join(
        `${artifactsLocation}`,
        'interbit.manifest.json'
      ))

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
      assert.deepEqual(configuredApps, builtApps)

      const configuredCovenantAliases = Object.keys(originalConfig.covenants)
      const builtCovenantAliases = Object.keys(manifest.covenants)
      assert.deepEqual(builtCovenantAliases, configuredCovenantAliases)

      const configuredChains = Object.keys(originalConfig.staticChains)
      const builtChains = Object.keys(manifest.chains)
      assert.deepEqual(builtChains, configuredChains)

      const covenantFilenames = Object.values(manifest.covenants).map(
        covenant => covenant.filename
      )

      for (const covenantFilename of covenantFilenames) {
        assert.ok(fs.existsSync(covenantFilename))
      }
    }

    it('makes a valid build with just a config', async () => {
      const configLocation = path.join(__dirname, '../interbit.config.js')
      const artifactsLocation = 'tmp/dist'
      await executeInterbitScript(
        'build',
        `--config ${configLocation} --artifacts ${artifactsLocation}`
      )

      // eslint-disable-next-line
      const originalConfig = require(configLocation)
      assertBuildCorrectness(artifactsLocation, originalConfig)
    })

    it('makes a valid build with a config and manifest', async () => {
      const configLocation = path.join(__dirname, '../interbit.config.js')
      const manifestLocation = path.join(__dirname, '../interbit.manifest.json')
      const artifactsLocation = 'tmp/dist'
      await executeInterbitScript(
        'build',
        `--config ${configLocation} --manifest ${manifestLocation} --artifacts ${artifactsLocation}`
      )

      // eslint-disable-next-line
      const originalConfig = require(configLocation)
      assertBuildCorrectness(artifactsLocation, originalConfig)

      // also check to make sure the genesis blocks that were already there didn't change
      // eslint-disable-next-line
      const manifest = require(path.join(
        `${artifactsLocation}`,
        'interbit.manifest.json'
      ))
      // eslint-disable-next-line
      const existingManifest = require(manifestLocation)
      assert.deepEqual(manifest.genesisBlocks, existingManifest.genesisBlocks)
    })
  })

  describe('deploy', () => {
    beforeEach(async () => {
      fs.mkdirpSync('tmp')
      const configLocation = path.join(__dirname, '../interbit.config.js')
      const artifactsLocation = 'tmp/dist'
      await executeInterbitScript(
        'build',
        `--config ${configLocation} --artifacts ${artifactsLocation}`
      )
    })

    afterEach(() => {
      fs.rmdirSync('tmp')
    })

    const outputHasChainIds = output => {
      throw new Error('NOT IMPLEMENTED')
    }

    const getChainFromOutput = output => {
      throw new Error('NOT IMPLEMENTED')
    }

    const isOutputDone = output => {
      throw new Error('NOT IMPLEMENTED')
    }

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

    it('deploys the chains specified in the manifest and configures them', async () => {
      const manifestLocation = path.join(__dirname, '../interbit.manifest.json')
      const artifactsLocation = 'tmp/dist'

      // execute the deploy command as event emitter
      const emitter = interbitScriptStdoutEvents(
        'build',
        `--manifest ${manifestLocation} --artifacts ${artifactsLocation}`
      )

      // eslint-disable-next-line
      const manifest = require(manifestLocation)

      const chains = []
      emitter.on('data', async stdout => {
        // save the output chain IDs
        if (outputHasChainIds(stdout)) {
          const chain = getChainFromOutput(stdout)
          chains.push(chain)
        }

        // wait til it pipes out that it is done
        if (isOutputDone(stdout)) {
          // attempt to connect to the chains
          // TODO: start a hypervisor using manifest admin keys (not using keys yet)
          // eslint-disable-next-line
          const keys = require(path.join(__dirname, '../keys.json'))
          const cli = await interbit.startInterbit(keys)

          for (const chain of chains) {
            await cli.loadChain(chain.chainId)
            const chainInterface = cli.getChain(chain.chainId)
            const chainState = chainInterface.getState()

            assertChainCorrectness(chain, chainState, manifest)
          }
        }
      })
    })
  })

  describe('keys', () => {
    it('makes a keypair', async () => {
      const filename = 'tmp/keys.json'

      await executeInterbitScript('keys', `--filename ${filename}`)

      // eslint-disable-next-line
      const keysFile = require(filename)
      assert.ok(keysFile)
      assert.ok(keysFile.publicKey)
      assert.ok(keysFile.privateKey)
    })
  })
})
