const { ACTION_PREFIX } = require('./constants')

const actionTypes = {
  INTERBIT_STATUS: `${ACTION_PREFIX}/INTERBIT_STATUS`,
  INTERBIT_PUBLIC_KEY: `${ACTION_PREFIX}/INTERBIT_PUBLIC_KEY`,
  INTERBIT_READY: `${ACTION_PREFIX}/INTERBIT_READY`,
  INTERBIT_ERROR: `${ACTION_PREFIX}/INTERBIT_ERROR`,

  INITIAL_CONFIG: `${ACTION_PREFIX}/INITIAL_CONFIG`,

  LOAD_INTERBIT_SAGA: `${ACTION_PREFIX}/LOAD_INTERBIT_SAGA`,
  PRIVATE_CHAIN_SAGA: `${ACTION_PREFIX}/PRIVATE_CHAIN_SAGA`,
  SPONSOR_CHAIN_SAGA: `${ACTION_PREFIX}/SPONSOR_CHAIN_SAGA`,

  CHAIN_UPDATED: `${ACTION_PREFIX}/CHAIN_UPDATED`,
  CHAIN_BLOCK_ADDED: `${ACTION_PREFIX}/CHAIN_BLOCK_ADDED`,
  CHAIN_DISPATCH: `${ACTION_PREFIX}/CHAIN_DISPATCH`,
  CHAIN_SPONSORING: `${ACTION_PREFIX}/CHAIN_SPONSORING`,
  CHAIN_LOADING: `${ACTION_PREFIX}/CHAIN_LOADING`,
  CHAIN_LOADED: `${ACTION_PREFIX}/CHAIN_LOADED`,
  CHAIN_SUBSCRIBED: `${ACTION_PREFIX}/CHAIN_SUBSCRIBE`,
  CHAIN_BLOCKING: `${ACTION_PREFIX}/CHAIN_BLOCKING`,
  CHAIN_ERROR: `${ACTION_PREFIX}/CHAIN_ERROR`,
  CHAIN_GENESIS: `${ACTION_PREFIX}/CHAIN_GENESIS`,
  CHAIN_STATUS: `${ACTION_PREFIX}/CHAIN_STATUS`,
  CHAIN_DELETING: `${ACTION_PREFIX}/CHAIN_DELETING`,
  CHAIN_DELETED: `${ACTION_PREFIX}/CHAIN_DELETED`
}

const actionCreators = {
  loadInterbitSaga: () => ({
    type: actionTypes.LOAD_INTERBIT_SAGA,
    payload: {}
  }),

  privateChainSaga: ({
    publicChainAlias,
    privateChainAlias,
    sponsoredChainId,
    privateChainId
  }) => ({
    type: actionTypes.PRIVATE_CHAIN_SAGA,
    payload: {
      publicChainAlias,
      privateChainAlias,
      sponsoredChainId,
      privateChainId
    }
  }),

  sponsorChainSaga: ({ chainAlias, publicChainAlias }) => ({
    type: actionTypes.SPONSOR_CHAIN_SAGA,
    payload: {
      chainAlias,
      publicChainAlias
    }
  }),

  chainUpdated: (chainAlias, chainState) => ({
    type: actionTypes.CHAIN_UPDATED,
    payload: {
      chainAlias,
      chainState
    }
  }),

  chainBlockAdded: (chainAlias, newBlock) => ({
    type: actionTypes.CHAIN_BLOCK_ADDED,
    payload: {
      chainAlias,
      newBlock
    }
  }),

  chainDispatch: (chainAlias, action) => ({
    type: actionTypes.CHAIN_DISPATCH,
    payload: {
      chainAlias,
      action
    }
  }),

  chainSubscribed: (chainAlias, chainState) => ({
    type: actionTypes.CHAIN_SUBSCRIBED,
    payload: {
      chainAlias,
      chainState
    }
  }),

  chainBlocking: chainAlias => ({
    type: actionTypes.CHAIN_BLOCKING,
    payload: {
      chainAlias
    }
  }),

  chainSponsoring: ({ chainAlias }) => ({
    type: actionTypes.CHAIN_SPONSORING,
    payload: {
      chainAlias
    }
  }),

  chainLoading: ({ chainAlias }) => ({
    type: actionTypes.CHAIN_LOADING,
    payload: {
      chainAlias
    }
  }),

  chainLoaded: ({ chainAlias, chainId }) => ({
    type: actionTypes.CHAIN_LOADED,
    payload: {
      chainAlias,
      chainId
    }
  }),

  chainGenesis: ({ chainAlias, chainId, genesisBlock }) => ({
    type: actionTypes.CHAIN_GENESIS,
    payload: {
      chainAlias,
      chainId,
      genesisBlock
    }
  }),

  chainStatus: ({ chainAlias, status }) => ({
    type: actionTypes.CHAIN_STATUS,
    payload: {
      chainAlias,
      status
    }
  }),

  chainError: ({ chainAlias, error }) => ({
    type: actionTypes.CHAIN_ERROR,
    payload: {
      chainAlias,
      error
    }
  }),

  chainDeleting: ({ chainAlias, chainId }) => ({
    type: actionTypes.CHAIN_DELETING,
    payload: {
      chainAlias,
      chainId
    }
  }),

  chainDeleted: ({ chainAlias, chainId }) => ({
    type: actionTypes.CHAIN_DELETED,
    payload: {
      chainAlias,
      chainId
    }
  }),

  interbitStatus: status => ({
    type: actionTypes.INTERBIT_STATUS,
    payload: {
      status
    }
  }),

  interbitReady: () => ({
    type: actionTypes.INTERBIT_READY,
    payload: {}
  }),

  interbitError: error => ({
    type: actionTypes.INTERBIT_ERROR,
    payload: {
      error
    }
  }),

  interbitPublicKey: publicKey => ({
    type: actionTypes.INTERBIT_PUBLIC_KEY,
    payload: {
      publicKey
    }
  }),

  initialConfig: initialConfig => ({
    type: actionTypes.INITIAL_CONFIG,
    payload: initialConfig
  })
}

module.exports = {
  actionTypes,
  actionCreators
}
