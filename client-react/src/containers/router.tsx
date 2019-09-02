import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Lander } from './lander'

export function SavvaRouter() {
  return (
    <Router>
      <Route path="/" exact component={Lander} />
    </Router>
  )
}
