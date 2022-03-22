import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App';

ReactDOM.render(
  <App dollars={(139.5866).toFixed(2)} />,
  document.getElementById('root')
);
