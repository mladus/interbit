const {
  coreCovenant: {
    actionCreators: {
      startConsumeState,
      startProvideState,
      authorizeReceiveActions,
      authorizeSendActions
    }
  },
  config: {
    selectors: { getChainJoins, getJoinTypeForChain }
  },
  constants: { JOIN_TYPES }
} = require('interbit-covenant-tools')

// SET FOR DEPRECATION: Pending issue #79
const joinChains = async (manifest, cli, config) => {
  console.log('JOINING CHAINS')
  try {
    for (const [chainAlias, chainDetails] of Object.entries(manifest)) {
      const chainInterface = await cli.getChain(chainDetails.chainId)
      if (getChainJoins(chainAlias, config)) {
        const provide = getJoinTypeForChain(
          chainAlias,
          JOIN_TYPES.PROVIDE,
          config
        )
        const consume = getJoinTypeForChain(
          chainAlias,
          JOIN_TYPES.CONSUME,
          config
        )
        const sendActionTo = getJoinTypeForChain(
          chainAlias,
          JOIN_TYPES.SEND,
          config
        )
        const receiveActionFrom = getJoinTypeForChain(
          chainAlias,
          JOIN_TYPES.RECEIVE,
          config
        )

        await establishConsumes(chainInterface, consume, manifest)
        await establishProvides(chainInterface, provide, manifest)
        await establishReceiveActions(
          chainInterface,
          receiveActionFrom,
          manifest
        )
        await establishSendActions(chainInterface, sendActionTo, manifest)
      }
      const state = await chainInterface.getState()
      console.log({ chainAlias, chainDetails, state })
    }

    console.log('JOINING COMPLETE')
  } catch (err) {
    console.error(err.message)
    throw err
  }
}

const establishConsumes = async (chainInterface, consume, manifest) => {
  if (!consume || !consume.length) {
    return
  }
  for (const { alias, path: mount, joinName } of consume) {
    if (!alias || !manifest[alias]) {
      console.warn(`Unknown alias: ${alias}`)
      continue
    }
    const { chainId: provider } = manifest[alias]
    const consumeAction = startConsumeState({
      provider,
      mount,
      joinName
    })
    console.log(consumeAction)
    await chainInterface.dispatch(consumeAction)
  }
}

const establishProvides = async (chainInterface, provide, manifest) => {
  if (!provide || !provide.length) {
    return
  }
  for (const { alias, path: statePath, joinName } of provide) {
    if (!alias || !manifest[alias]) {
      console.warn(`Unknown alias: ${alias}`)
      continue
    }
    const { chainId: consumer } = manifest[alias]
    const provideAction = startProvideState({
      consumer,
      statePath,
      joinName
    })
    console.log(provideAction)
    await chainInterface.dispatch(provideAction)
  }
}

const establishReceiveActions = async (
  chainInterface,
  receiveActionFrom,
  manifest
) => {
  if (!receiveActionFrom || !receiveActionFrom.length) {
    return
  }
  for (const { alias, authorizedActions } of receiveActionFrom) {
    if (!alias || !manifest[alias]) {
      console.warn(`Unknown alias: ${alias}`)
      continue
    }
    if (!authorizedActions) {
      console.warn(`No authorized actions for write join to: ${alias}`)
      continue
    }
    const { chainId: senderChainId } = manifest[alias]
    const authorizeReceiveAction = authorizeReceiveActions({
      senderChainId,
      permittedActions: authorizedActions
    })
    console.log(authorizeReceiveAction)
    await chainInterface.dispatch(authorizeReceiveAction)
  }
}

const establishSendActions = async (chainInterface, sendActionTo, manifest) => {
  if (!sendActionTo || !sendActionTo.length) {
    return
  }
  for (const { alias } of sendActionTo) {
    if (!alias || !manifest[alias]) {
      console.warn(`Unknown alias: ${alias}`)
      continue
    }
    const { chainId: receiverChainId } = manifest[alias]
    const authorizeSendAction = authorizeSendActions({
      receiverChainId
    })
    console.log(authorizeSendAction)
    await chainInterface.dispatch(authorizeSendAction)
  }
}

module.exports = { joinChains }
