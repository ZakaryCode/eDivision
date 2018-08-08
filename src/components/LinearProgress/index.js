/**
 * @author zakary
 * @description 弹出Toast
 */

import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {LinearProgress} from '@material-ui/core';

import {observer} from 'mobx-react';

import lineProgress from '../../store/lineProgress';
import './index.css';

@observer class container extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <LinearProgress
          style={{
          display: (lineProgress.open
            ? 'block'
            : 'none')
        }}
          color="primary"/>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1
  }
});

export default withStyles(styles)(container);