import 'styles/App.scss'
import { hot } from 'react-hot-loader'
import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import ErrorBoundary from 'views/widgets/ErrorBoundary'
import Footer from 'views/widgets/Footer'
import Nav from 'views/widgets/Nav'
import Home from 'views/Home'
import ChatRoom from 'views/ChatRoom'
import WebcamShare from 'views/WebcamShare'
import ScreenShare from 'views/ScreenShare'
import ViewStream from 'views/ViewStream'

const App = () => (
  <Router>
    <ErrorBoundary>
      <>
        <Switch>
          <Route path='/chatRoom'>
            <Nav />
            <ChatRoom />
            <Footer />
          </Route>
          <Route path='/shareWebcam'>
            <Nav />
            <WebcamShare />
            <Footer />
          </Route>
          <Route path='/shareScreen'>
            <Nav />
            <ScreenShare />
            <Footer />
          </Route>
          <Route path='/view'>
            <ViewStream />
          </Route>
          <Route path='/'>
            <Nav />
            <Home />
            <Footer />
          </Route>
        </Switch>
      </>
    </ErrorBoundary>
  </Router>
)

export default hot(module)(App)
