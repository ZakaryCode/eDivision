/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {Paper, } from 'material-ui';
import {Button, Divider, withStyles} from 'material-ui';
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';

import snack from '../../store/snack';
import Drawer from "../../components/Drawer";
import leftDrawer from '../../store/leftDrawer';
import bottomDrawer from '../../store/bottomDrawer';
import app from '../../store/app';
// import * as R from "../../conf/RegExp";
const fs = window.require('fs'),
  _path_ = window.require('path'),
  electron = window.require("electron");
const ipc = electron.ipcRenderer;

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      leftOpen: leftDrawer.open,
      bottomOpen: bottomDrawer.open
    };
    const setState = (name, data, s = () => {}) => {
      this.setState({
        [name]: data
      }, s);
    };
    ipc.on('Reader-Path-Send', (event, data) => {
      setTimeout(() => {
        console.log("Reader-Path-Send", data);
        setState("file", data, this.handleClickFile);
      }, 500);
    });
  }

  handleClickFile = () => {
    const {file} = this.state,
      setState = (name, data, s = () => {}) => {
        this.setState({
          [name]: data
        }, s);
      };
    if (!file) {
      snack.setMessage("请先选择文件!");
      return;
    } else {
      console.log("file", file);
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          ipc.send("open-error-get-file-dialog");
        } else {
          console.log("fileData", data);
          setState("fileData", data);
        }
      });
    }
  }

  handleDrawerOpen = name => open => {
    this.setState({
      [name]: open
    }, () => {
      console.log("handleDrawerOpen", name, this.state[name])
    });
    if (name === "leftOpen") {
      leftDrawer.isOpen(open);
    }
    if (name === "bottomOpen") {
      bottomDrawer.isOpen(open);
    }
  };

  handleMouseMove = e => {
    const {BOOK_CATALOG, TOOLS_BAR} = this, {leftOpen, bottomOpen} = this.state,
      CATALOG = BOOK_CATALOG.children[0].children[0],
      TOOLSBAR = TOOLS_BAR.children[0].children[0];
    console.log(leftOpen, bottomOpen, CATALOG.offsetLeft + CATALOG.offsetWidth + 10, e.clientX, TOOLSBAR.offsetTop - TOOLSBAR.offsetHeight - 10, e.clientY);

    if (CATALOG.offsetLeft + CATALOG.offsetWidth + 10 > e.clientX && !leftOpen) {
      console.log("打开目录", CATALOG.offsetLeft + CATALOG.offsetWidth + 10, e.clientX);
      this.handleDrawerOpen("leftOpen")(true);
    } else if (CATALOG.offsetLeft + CATALOG.offsetWidth + 10 <= e.clientX && leftOpen) {
      console.log("关闭目录", CATALOG.offsetLeft + CATALOG.offsetWidth + 10, e.clientX);
      this.handleDrawerOpen("leftOpen")(false);
    } else if (TOOLSBAR.offsetTop - TOOLSBAR.offsetHeight - 10 < e.clientY && !bottomOpen) {
      console.log("打开工具栏", TOOLSBAR.offsetTop - TOOLSBAR.offsetHeight - 10, e.clientY);
      this.handleDrawerOpen("bottomOpen")(true);
    } else if (TOOLSBAR.offsetTop - TOOLSBAR.offsetHeight - 10 >= e.clientY && bottomOpen) {
      console.log("关闭工具栏", TOOLSBAR.offsetTop - TOOLSBAR.offsetHeight - 10, e.clientY);
      this.handleDrawerOpen("bottomOpen")(false);
    }
  }

  handleInputRef = name => node => {
    if (node) {
      // console.log(name, node, node.offsetLeft, node.offsetWidth, node.offsetTop,
      // node.offsetHeight);
      this[name] = node;
    }
  }

  render() {
    const {classes} = this.props, {leftOpen, bottomOpen} = this.state;
    console.log(leftOpen, bottomOpen);

    return (
      <div
        className={classes.content}
        onMouseLeave={this.handleMouseMove}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleMouseMove}
        onMouseOver={this.handleMouseMove}
        ref={this.handleInputRef("CONTENT")}>
        <div className="bookContent" ref={this.handleInputRef("BOOK_CONTENT")}></div>
        <div className="bookCatalog" ref={this.handleInputRef("BOOK_CATALOG")}>
          <Drawer
            anchor="left"
            open={leftOpen}
            className={classes.drawerPaper}
            handleDrawerOpen={this.handleDrawerOpen("leftOpen")}>
            <div>
              <List>
                <ListItem button onClick={() => {}}>
                  <ListItemText primary="主页"/>
                </ListItem>
              </List>
            </div>
          </Drawer>
        </div>
        <div className="toolsBar" ref={this.handleInputRef("TOOLS_BAR")}>
          <Drawer
            anchor="bottom"
            open={bottomOpen}
            className={classes.drawerPaper}
            handleDrawerOpen={this.handleDrawerOpen("bottomOpen")}>
            <div>
              <List>
                <Button color="primary" onClick={this.handleClickFile}>
                  读取文件
                </Button>
                <Button color="primary" onClick={this.handleClickFile}>
                  读取文件
                </Button>
                <Button color="primary" onClick={this.handleClickFile}>
                  读取文件
                </Button>
              </List>
            </div>
          </Drawer>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  content: {
    width: "100%",
    height: "100%",
    paddingBottom: "75%"
  },
  drawerPaper: {
    width: app.drawerWidth,
    height: 'calc(100% - ' + app.headerHeight + ')',
    top: app.headerHeight,
    borderWidth: 0
  }
});

export default withStyles(styles)(Content);