import { List } from 'immutable'
import { ERROR } from 'js/actions/error'

export default function errors (state = List(), action) {
  switch (action.type) {
    case ERROR:
      state = state.push(action.error)
      break
  }
  return state
}
