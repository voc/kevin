import { Map } from 'immutable'
import { PARSED_PARAMS } from 'js/actions/params'
import { SET_ROOMID } from 'js/actions/roomid'

export default function params (state = Map(), action) {
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
      break

    case SET_ROOMID:
      state = state.set('roomid', action.roomid)
      break
  }
  console.log('got root', state.toJS())
  return state
}
