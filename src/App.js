import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import DevTools from 'mobx-react-devtools'; // 测试使用的mobx管理工具
import {Button, withStyles} from 'material-ui';
import classNames from 'classnames';
import logo from './logo.svg';
import './styles/App.css';

import Snackbar from './components/Snackbar';
import DialogAlert from './components/Dialog';
import LinearProgress from './components/LinearProgress';

import Home from './routes/Home';

const electron = window.require('electron');
const {remote} = electron;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devtools: false
    };
  }
  UNSAFE_componentWillMount() {
    console.log(window, electron.remote.getCurrentWebContents());
    console.log(remote.getCurrentWebContents().isDevToolsOpened());
    this.setState({
      devtools: remote
        .getCurrentWebContents()
        .isDevToolsOpened()
    });
  }

  openDevToolsHandle = (event) => {
    // 打开调试工具DevTools.
    console.log(event.target);
    if (remote.getCurrentWebContents().isDevToolsOpened()) {
      remote
        .getCurrentWebContents()
        .closeDevTools();
      this.setState({devtools: false});
    } else {
      remote
        .getCurrentWebContents()
        .openDevTools();
      this.setState({devtools: true});
    }
  };

  render() {
    return (
      <Router className="App">
        <div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">欢迎使用文件分割</h1>
            <Button
              color="primary"
              style={{
              position: 'absolute',
              right: 16,
              bottom: '2em'
            }}
              onClick={this.openDevToolsHandle}>
              DevTools
            </Button>
            <div
              style={{
              display: this.state.devtools
                ? "block"
                : "none"
            }}>
              <DevTools/>
            </div>
          </header>
          <div>
            <LinearProgress/>
            <Route exact path="/" component={Home}/>
            <Route exact path="/Home" component={Home}/></div>
          <Snackbar/>
          <DialogAlert/>
        </div>
      </Router>
    );
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1
  },
  appFrame: {
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%'
  },
  content: {
    flexGrow: 1,
    overflowY: 'scroll',
    marginTop: theme.spacing.unit * 5,
    paddingTop: theme.spacing.unit * 3,
    position: 'relative'
  }
});

export default withStyles(styles)(App);
