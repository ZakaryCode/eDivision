/**
 * @author zakary
 * @description 弹出Dialog
 */

import React, {Component} from 'react';
import {Button, withStyles} from 'material-ui';
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui/Dialog';
import PropTypes from 'prop-types';

import {observer} from 'mobx-react';
import {observable} from "mobx";

import dialog from '../../store/dialog';
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
    dialog.setMessage(msg);
  };

  handleRight = () => {
    if (typeof dialog.callback === 'function') {
      dialog.callback();
      this.handleClose();
    } else {
      this.handleClose();
    }
  };

  handleClose = () => {
    dialog.setMessage();
  };

  render() {
    const {classes} = this.props;
    const {vertical, horizontal} = this.state;

    let msg = '';
    try {
      msg = JSON.parse(dialog.message);
    } catch (error) {
      msg = {
        title: '提示',
        content: dialog.message
      };
    }
    let buttons = (
      <DialogActions>
        {typeof dialog.callback === 'function'
          ? <Button
              tabIndex={0}
              color="secondary"
              onClick={this.handleClose}
              data-index={0}>
              取消
            </Button>
          : ''}
        <Button tabIndex={1} color="primary" onClick={this.handleRight} data-index={1}>确定</Button>
      </DialogActions>
    );
    return (
      <Dialog
        key={0}
        open={dialog.open}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle className={classes.MuiDialogTitle}>{msg.title || '提示'}</DialogTitle>
        <DialogContent className={classes.MuiDialogContent}>
          {msg.content || ''}
        </DialogContent>
        {buttons}
      </Dialog>
    );
  }
}

const styles = (theme) => ({});

export default withStyles(styles)(container);