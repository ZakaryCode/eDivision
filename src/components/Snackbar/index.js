/**
 * @author zakary
 * @description 弹出Toast
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';

import {observer} from 'mobx-react';

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