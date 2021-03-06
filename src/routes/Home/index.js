/**
 * @author zakary
 * @description Home
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Content from './Content';
import './index.css';

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  handleLoadURL = (name) => () => {
    let hash = "/" + name;
    window.location.hash = hash;
    console.log(window.location, window.location.hash);
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <div className="App-menu">
          <Button
            className="App-menu-button"
            color="primary"
            onClick={this.handleLoadURL("Home")}>
            读取文件
          </Button>
          <Button
            className="App-menu-button"
            color="primary"
            onClick={this.handleLoadURL("Division")}>
            分割文件
          </Button>
          <Button
            className="App-menu-button"
            color="primary"
            onClick={this.handleLoadURL("Connected")}>
            合并文件
          </Button>
        </div>
        <Content/>
      </div>
    );
  }
}

const styles = (theme) => ({root: {}});

export default withStyles(styles)(Home);