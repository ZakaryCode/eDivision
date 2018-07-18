/**
 * @author zakary
 * @description 弹出Toast
 */

import React, {Component} from 'react';
import {LinearProgress, withStyles} from 'material-ui';
import PropTypes from 'prop-types';

import {observer} from 'mobx-react';
import {observable} from "mobx";

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