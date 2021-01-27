import { Store } from 'aredux'
import root from 'js/reducers/root'

// const reducers = new Map()
// reducers.set('params', params)

const store = new Store(root)
export default store
