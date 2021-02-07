import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'aredux/lib/react'

import { parseParams } from 'js/actions/params'
import { setRoomId } from 'js/actions/roomid'
import { generateRoomId } from 'js/util'
import 'js/getHTMLMediaElement'
import store from 'js/store'
import App from 'views/App'

// import { getURLParams, getRoomID } from 'js/util'
// import Connection from 'js/Connection'

// detect 2G
if (navigator.connection &&
  navigator.connection.type === 'cellular' &&
  navigator.connection.downlinkMax <= 0.115) {
  alert('2G is not supported. Please use a better internet service.')
}

// generate random roomid
store.dispatch(setRoomId(generateRoomId()))

// parse url parameters
store.dispatch(parseParams())

// Mount App in html page
render(<Provider store={store}><App /></Provider>, document.getElementById('app'))
