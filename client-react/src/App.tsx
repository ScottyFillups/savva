import React  from 'react';
import { SavvaRouter } from './containers/router'
import { api } from './api/ws'

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

api.initialize({
  onDestroy: console.log,
  onStream: (targetID, stream) => console.log(targetID)
})

const App: React.FC = () => {
  return (
    <SavvaRouter />
  );
}

export default App;
