/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {Paper, Button} from 'material-ui';
import {withStyles} from 'material-ui';

// import snack from '../../store/snack';
import DrawerLeft from "../../components/DrawerLeft";
import leftDrawer from '../../store/leftDrawer';
// import * as R from "../../conf/RegExp"; const fs = window.require('fs'),
// _path_ = window.require('path'),   electron = window.require("electron");

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      open: leftDrawer.open
    };
  }

  handleDrawerLeft = (open) => {
    this.setState({open: open});
    leftDrawer.isOpen(open);
  };

  handleMouseMove = e => {
    const {BOOK_CATALOG} = this,
      CATALOG = BOOK_CATALOG.children[0].children[0];
    // console.log(e.clientX, e.clientY, e.target);
    // console.log(BOOK_CONTENT.offsetLeft, BOOK_CONTENT.offsetTop,
    // BOOK_CONTENT.offsetWidth, BOOK_CONTENT.offsetHeight); 目录管理
    if (CATALOG.offsetLeft + CATALOG.offsetWidth + 10 > e.clientX && !this.state.open) {
      console.log("打开目录", CATALOG.offsetLeft + CATALOG.offsetWidth + 10, e.clientX);
      this.handleDrawerLeft(true);
    } else if (CATALOG.offsetLeft + CATALOG.offsetWidth + 10 <= e.clientX && this.state.open) {
      console.log("关闭目录", CATALOG.offsetLeft + CATALOG.offsetWidth + 10, e.clientX);
      this.handleDrawerLeft(false);
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
    const {classes} = this.props;

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
          <DrawerLeft handleDrawerLeft={this.handleDrawerLeft}/>
        </div>
        <div className="toolsBar" ref={this.handleInputRef("TOOLS_BAR")}></div>
      </div>
    );
  }
}

const styles = (theme) => ({
  content: {
    width: "100%",
    height: "100%",
    paddingBottom: "75%"
  }
});

export default withStyles(styles)(Content);