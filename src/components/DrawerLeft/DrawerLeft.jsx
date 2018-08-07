/**
 * @author zakary
 * @description 左侧抽屉
 */

import React, {Component} from 'react';
import {Drawer, List, Divider, withStyles} from 'material-ui';
import PropTypes from 'prop-types';

import {observer} from 'mobx-react';
import {observable, computed} from "mobx";

import app from '../../store/app';
import leftDrawer from '../../store/leftDrawer';
import {mailFolderListItems, otherMailFolderListItems} from './tileData';
import './DrawerLeft.css';

@observer class DrawerLeft extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleDrawerLeft: PropTypes.func.isRequired
  }

  static defaultProps = {}

  @computed get index() {
    return this.index;
  }
  @observable index = 0;

  handleClose = (event) => {
    leftDrawer.isOpen(false);
    this
      .props
      .handleDrawerLeft(false);
  };

  render() {
    const {classes} = this.props;
    let isThereDrawer = (
      <Drawer
        anchor="left"
        variant="persistent"
        open={leftDrawer.open}
        onClose={this.handleClose}
        classes={{
        paper: classes.drawerPaper
      }}>
        <div className={classes.toolbar}/>
        <List>{mailFolderListItems}</List>
        <Divider/>
        <List>{otherMailFolderListItems}</List>
      </Drawer>
    );
    return (isThereDrawer);
  }
}

const styles = (theme) => ({
  drawerPaper: {
    width: app.drawerWidth,
    height: 'calc(100% - ' + app.headerHeight + ')',
    top: app.headerHeight,
    borderWidth: 0
  }
});

export default withStyles(styles)(DrawerLeft);