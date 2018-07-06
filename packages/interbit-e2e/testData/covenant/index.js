const Immutable = require('seamless-immutable')
const { rootCovenant } = require('interbit-covenant-tools')

const initialState = Immutable.from({
  appState: 'meow'
})

const actionTypes = {
  APP_STATE: 'APP_STATE'
}

const actionCreators = {
  changeAppState: appState => ({
    type: actionTypes.APP_STATE,
    payload: {
      appState
    }
  })
}

const reducer = (state, action) => {
  const nextState = rootCovenant.reducer(state, action)
  const { appState } = action.payload

  if (action.type === actionTypes.APP_STATE) {
    return {
      ...nextState,
      appState
    }
  }

  return nextState
}

module.exports = {
  actionCreators,
  initialState,
  reducer
}
