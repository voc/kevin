import { Map } from 'immutable'
import { ADDED_STREAM, REMOVED_STREAM } from 'js/actions/stream'

export default function streams (state = new Map(), action) {
  switch (action.type) {
    case ADDED_STREAM:
      state = state.set(action.stream.userid, action.stream)
      break
    case REMOVED_STREAM:
      state = state.delete(action.userid)
      break
  }
  return state
}
