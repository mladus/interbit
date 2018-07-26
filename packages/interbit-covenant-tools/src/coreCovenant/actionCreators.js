const { createAction } = require('interbit-covenant-utils')

const { DEPLOY_COVENANT, REMOVE_JOIN_CONFIG } = require('./actionTypes')

const actionCreators = {
  applyCovenant: ({ covenantHash }) =>
    createAction(DEPLOY_COVENANT, { covenantHash }),
  removeJoinConfig: ({ chainId }) =>
    createAction(REMOVE_JOIN_CONFIG, { fromChainId: chainId })
}

module.exports = actionCreators
