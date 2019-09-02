import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Lander } from './lander'
import { Room } from './room'

export function SavvaRouter() {
  return (
    <Router>
      <Route path="/" exact component={Lander} />
      <Route path="/room/:roomID" exact component={Room} />
    </Router>
  )
}
