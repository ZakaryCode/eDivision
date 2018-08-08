
import React from 'react';
import ReactDOM from 'react-dom';
import {MuiThemeProvider} from '@material-ui/core';

import './styles/index.css';
import App from './App';
import uiTheme from './conf/theme';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <MuiThemeProvider theme={uiTheme}>
    <App/>
  </MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
