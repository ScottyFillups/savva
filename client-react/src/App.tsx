import React  from 'react';
import { SavvaRouter } from './containers/router'

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

const App: React.FC = () => {
  return (
    <SavvaRouter />
  );
}

export default App;
