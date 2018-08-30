/**
 * @author zakary
 * @description App
 */
import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import DevTools from 'mobx-react-devtools'; // 测试使用的mobx管理工具
import {withStyles} from '@material-ui/core/styles';
import logo from './logo.svg';
import './styles/App.css';

import Snackbar from './components/Snackbar';
import DialogAlert from './components/Dialog';
import LinearProgress from './components/LinearProgress';

import Home from './routes/Home';
import Division from './routes/Division';
import Connected from './routes/Connected';
import Reader from './routes/Reader';

const electron = window.require('electron');
const {remote} = electron;
const ipc = electron.ipcRenderer;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devtools: false
    };
    const setState = (name, data) => {
      this.setState({[name]: data});
    };

    remote
      .getCurrentWindow()
      .on('did-navigate-in-page', (event, url, isMainFrame) => {
        // 页面内导航监听.
        console.log('did-navigate-in-page', event, url, isMainFrame);
      });

    console.log(window.location.hash, electron, remote.getCurrentWebContents());
    setState("devtools", remote.getCurrentWebContents().isDevToolsOpened());
    ipc.on('toggle-dev-tools', (event, data) => {
      // 打开调试工具DevTools.
      setTimeout(() => {
        // console.log(event, remote.getCurrentWebContents().isDevToolsOpened());
        setState("devtools", remote.getCurrentWebContents().isDevToolsOpened());
      }, 500);
    });
  }

  render() {
    return (
      <Router className="App">
        <div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">{"欢迎使用文件分割"}</h1>
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
            <Route exact path="/Home" component={Home}/>
            <Route exact path="/Division" component={Division}/>
            <Route exact path="/Connected" component={Connected}/>
            <Route exact path="/Reader" component={Reader}/>
          </div>
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
