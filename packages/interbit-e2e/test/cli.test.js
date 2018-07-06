const interbit = require('interbit')
const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')
const {
  getInterbitBinLocation,
  executeInterbitScript,
  interbitScriptStdoutEvents
} = require('../scripts/exec')
const {
  assertBuildCorrectness,
  requireBuiltManifest,
  outputHasChainIds,
  getChainFromOutput,
  isOutputDone,
  assertChainCorrectness
} = require('../helpers/assert')
const testCovenant = require('../testData/covenant')

const START_TIMEOUT = 120000
const BUILD_TIMEOUT = 4000
const DEPLOY_TIMEOUT = 80000

describe('run cli', () => {
  describe('helper unit tests', () => {
    it('gets the bin location for interbit-cli', async () => {
      const binLocation = await getInterbitBinLocation()
      assert.ok(binLocation)
    })

    it('covenant reducer sets the manifest', () => {
      const setManifestAction = {
        type: '@@MANIFEST/SET_MANIFEST',
        payload: {
          manifest: 'manifest'
        }
      }

      const result = testCovenant.reducer(
        testCovenant.initialState,
        setManifestAction
      )

      assert.equal(
        result.interbitRoot.manifest,
        setManifestAction.payload.manifest
      )
    })
  })

  beforeEach(() => {
    fs.mkdirpSync('tmp')
  })

  afterEach(() => {
    fs.removeSync('tmp')
  })

  it
    .only('starts successfully on a good config', async done => {
      const configLocation = path.join(__dirname, '../interbit.config.js')
      const emitter = await interbitScriptStdoutEvents(
        'start',
        `--config ${configLocation}`
      )

      // eslint-disable-next-line
    const originalConfig = require(configLocation)

      let chains = []

      // make sure nothing bad happened
      emitter.stderr.on('data', stderr => console.error(stderr.toString()))
      emitter.stdout.on('data', stdout => {
        const outputString = stdout.toString()
        console.log(outputString)
        const isChainIdInOutput = outputString.startsWith('{ chainManifest:')
        if (isChainIdInOutput) {
          const startManifest = JSON.parse(outputString)
          chains = Object.values(startManifest.chainManifest).map(
            chainData => chainData.chainId
          )

          console.log('FOUND CHAINS', chains)
        }

        const isStartOutputDone = outputString.startsWith(
          'Finished updating index.html with chain IDs'
        )
        if (isStartOutputDone) {
          console.log('DONE TEST')
          assert.equal(chains.length, 2)
          // TODO: assert the correct chainID was output in index.html
          // TODO: Connect to the chainID and getstate, assert it can be connected to
        }
      })
    })
    .timeout(START_TIMEOUT)

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
  }).timeout(BUILD_TIMEOUT)

  it('makes a valid build with a config and manifest', async () => {
    const configLocation = path.join(__dirname, '../interbit.config.js')
    const artifactsLocation = 'tmp/dist'
    const manifestLocation = path.join(
      __dirname,
      '../testData/dist/interbit.manifest.json'
    )
    const output = await executeInterbitScript(
      'build',
      `--config ${configLocation} --manifest ${manifestLocation} --artifacts ${artifactsLocation}`
    )

    console.log(output.stdout)

    // eslint-disable-next-line
      const originalConfig = require(configLocation)
    assertBuildCorrectness(artifactsLocation, originalConfig)

    // also check to make sure the genesis blocks that were already there didn't change
    // eslint-disable-next-line
      const existingManifest = require(manifestLocation)
    const manifest = requireBuiltManifest(artifactsLocation)
    assert.deepEqual(manifest.genesisBlocks, existingManifest.genesisBlocks)
  }).timeout(BUILD_TIMEOUT)

  it('deploys the chains specified in the manifest and configures them', async done => {
    const artifactsLocation = path.join(__dirname, '../testData/dist')
    const manifestLocation = path.join(
      artifactsLocation,
      'interbit.manifest.json'
    )
    const keysLocation = path.join(__dirname, '../testData/keys.json')

    const emitter = await interbitScriptStdoutEvents(
      'deploy',
      `--artifacts ${artifactsLocation} --key-pair ${keysLocation}`
    )

    emitter.stderr.on('data', stderr => console.log(stderr.toString()))

    const chains = []
    emitter.stdout.on('data', async stdout => {
      console.log(stdout.toString())
      // save the output chain IDs
      if (outputHasChainIds(stdout)) {
        const chain = getChainFromOutput(stdout)
        chains.push(chain)
        console.log('GATHERED CHAINS', chains)
      }

      // wait til it pipes out that it is done
      if (isOutputDone(stdout)) {
        console.log('OUTPUT COMPLETE - ASSERTING CHAIN CORRECTNESS')
        // attempt to connect to the chains

        // eslint-disable-next-line
              const keys = require(keysLocation)
        const cli = await interbit.startInterbit(keys)

        // eslint-disable-next-line
              const manifest = require(manifestLocation)
        for (const chain of chains) {
          await cli.loadChain(chain.chainId)
          const chainInterface = cli.getChain(chain.chainId)
          const chainState = chainInterface.getState()

          assertChainCorrectness(chain, chainState, manifest)
        }
        done()
      }
    })
  }).timeout(DEPLOY_TIMEOUT)

  it('makes a keypair', async () => {
    const filename = 'tmp/keys.json'

    await executeInterbitScript('keys', `--filename ${filename}`)

    // eslint-disable-next-line
      const keysFile = require(path.join(__dirname, '../', filename))
    assert.ok(keysFile)
    assert.ok(keysFile.publicKey)
    assert.ok(keysFile.privateKey)
  })
})
