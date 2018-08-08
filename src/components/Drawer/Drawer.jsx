/**
 * @author zakary
 * @description 左侧抽屉
 */

import React, {Component} from 'react';
import {Drawer, withStyles} from 'material-ui';
import PropTypes from 'prop-types';

import {observer} from 'mobx-react';
import {observable, computed} from "mobx";
import './Drawer.css';

@observer class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    const {classes, anchor, open, children} = this.props;

    let isThereDrawer = (
      <Drawer
        anchor={anchor}
        variant="persistent"
        open={open}
        onClose={this.handleClose}
        classes={{
        paper: classes.drawerPaper
      }}>{children}</Drawer>
    );
    return (isThereDrawer);
  }
}
// <List>{mailFolderListItems}</List> <Divider/>
// <List>{otherMailFolderListItems}</List>

const styles = (theme) => ({drawerPaper: {}});

export default withStyles(styles)(Content);