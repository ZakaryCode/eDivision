/**
 * @author zakary
 * @description 弹出Toast
 */

import React, {Component} from 'react';
import {Snackbar, withStyles} from 'material-ui';
import PropTypes from 'prop-types';

import {observer} from 'mobx-react';
import {observable} from "mobx";

import snack from '../../store/snack';
import './index.css';

@observer class container extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      vertical: 'bottom',
      horizontal: 'right'
    };
  }

  handleOpen = (msg) => {
    snack.setMessage(msg);
  };

  handleClose = () => {
    snack.setMessage();
  };

  render() {
    const {classes} = this.props;
    const {vertical, horizontal} = this.state;

    let setMessage = (msg) => (
      <span id="message-id">
        {msg}
      </span>
    );
    return (<Snackbar
      anchorOrigin={{
      vertical,
      horizontal
    }}
      open={snack.open}
      onClose={this.handleClose}
      SnackbarContentProps={{
      'aria-describedby': 'message-id'
    }}
      message={setMessage(snack.message)}/>);
  }
}

const styles = (theme) => ({});

export default withStyles(styles)(container);