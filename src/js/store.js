import { Store, combineReducers } from 'aredux'
import params from 'js/reducers/params'
import streams from 'js/reducers/streams'
import errors from 'js/reducers/errors'

const reducers = new Map()
reducers.set('params', params)
reducers.set('streams', streams)
reducers.set('errors', errors)

const store = new Store(combineReducers(reducers))
export default store
