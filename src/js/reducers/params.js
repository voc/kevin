import { Map } from 'immutable'
import { PARSED_PARAMS } from 'js/actions/params'
import { SET_ROOMID } from 'js/actions/roomid'
import { SET_RECORD, STARTED_RECORDING, STOPPED_RECORDING } from 'js/actions/recording'

const defaults = {
  record: false,
  recording: {
    active: false
  }
}

export default function params (state = new Map(defaults), action) {
  switch (action.type) {
    case PARSED_PARAMS:
      if (action.params.roomid) {
        state = state.set('roomid', action.params.roomid)
      }
      if (action.params.action) {
        state = state.set('action', action.params.action)
      }
      if (action.params.width) {
        const width = parseInt(action.params.width)
        if (!isNaN(width)) {
          state = state.set('width', width)
        }
      }
      if (action.params.record) {
        state = state.set('record', true)
      }
      break

    case SET_ROOMID:
      state = state.set('roomid', action.roomid)
      break

    case SET_RECORD:
      state = state.set('record', action.record)
      break

    case STARTED_RECORDING:
      if (!state.getIn(['recording', 'active'])) {
        state = state.setIn(['recording', 'active'], true)
        state = state.setIn(['recording', 'started'], Date.now())
        state = state.setIn(['recording', 'streams'], 1)
      } else {
        state = state.updateIn(['recording', 'streams'], streams => streams + 1)
      }
      break

    case STOPPED_RECORDING:
      state = state.setIn(['recording', 'active'], false)
      state = state.setIn(['recording', 'streams'], 0)
      state = state.set('record', false)
      break
  }
  return state
}
