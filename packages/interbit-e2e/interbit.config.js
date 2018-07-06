const path = require('path')
const keyPair = require('./testData/keys.json')

const config = {
  peers: ['localhost:5025'],
  adminValidators: [keyPair.publicKey],
  staticChains: {
    first: {
      covenant: 'doSomeThings',
      config: {
        validators: [keyPair.publicKey],
        joins: {
          consume: [
            {
              alias: 'second',
              path: ['sharedData'],
              joinName: 'SHARE'
            }
          ]
        }
      }
    },
    second: {
      covenant: 'doSomeThings',
      config: {
        validators: [keyPair.publicKey],
        joins: {
          provide: [
            {
              alias: 'first',
              path: ['appData'],
              joinName: 'SHARE'
            }
          ]
        }
      }
    }
  },
  covenants: {
    doSomeThings: {
      location: path.join(__dirname, 'testData/covenant')
    }
  },
  apps: {
    template: {
      peers: ['localhost:5000'],
      chains: ['first'],
      appChain: 'first',
      indexLocation: path.join(__dirname, 'testData/app/index.html'),
      buildLocation: path.join(__dirname, 'build/')
    }
  }
}

module.exports = config
