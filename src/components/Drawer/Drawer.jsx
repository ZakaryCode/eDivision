/**
 * @author zakary
 * @description 左侧抽屉
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import {observer} from 'mobx-react';
import {observable, computed} from "mobx";
import './Drawer.css';

@observer class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.object.isRequired,
    anchor: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleDrawerOpen: PropTypes.func.isRequired
  }

  static defaultProps = {}

  @computed get index() {
    return this.index;
  }

  @observable index = 0;

  handleClose = (event) => {
    this
      .props
      .handleDrawerOpen(false);
  };

  render() {
    const {classes, className, anchor, open, children} = this.props;

    let isThereDrawer = (
      <Drawer
        anchor={anchor}
        variant="persistent"
        open={open}
        onClose={this.handleClose}
        style={{
        visibility: open
          ? "visible"
          : "hidden"
      }}
        className={className}>{children}</Drawer>
    );
    return (isThereDrawer);
  }
}

const styles = (theme) => ({});

export default withStyles(styles)(Content);