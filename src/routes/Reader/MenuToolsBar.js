/**
 * @author zakary
 * @description 内容页
 * 开发纪要：
 * 添加字体、字号、字色、背景选择功能
 * 添加护眼模式、夜间模式、淡蓝、淡绿、淡粉、淡紫、牛皮纸、白瓷砖、大理石、纸张模式
 * 添加宽视距、中等视距、窄视距模式
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Drawer from "../../components/Drawer";
import Stepper from "../../components/Stepper";
import snack from '../../store/snack';
import leftDrawer from '../../store/leftDrawer';
import bottomDrawer from '../../store/bottomDrawer';
import bottomDrawerTools from '../../store/bottomDrawerTools';
import app from '../../store/app';
import * as R from "../../conf/RegExp";
import * as utils from "../../utils";
import base64 from "../../utils/base64";
import * as md5 from "../../utils/md5";
import AvatarButton, {images} from "./Avatar";
import SliderButton from "./MenuSlider";
import ColorPicker from "./MenuPickerColor";
import MenuButton from "./MenuList";

const _fs_ = window.require('fs'),
  _path_ = window.require('path'),
  electron = window.require("electron"),
  remote = electron.remote;
const ipc = electron.ipcRenderer;

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    fileL: PropTypes.number.isRequired,
    fileIndex: PropTypes.number.isRequired,
    handleSwitchPage: PropTypes.func.isRequired,
    handleDirOpen: PropTypes.func.isRequired,
    handleRadio: PropTypes.func.isRequired,
    handleClickFile: PropTypes.func.isRequired,
    handleDrawerOpen: PropTypes.func.isRequired,
    bottomOpen: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      fileData: [],
      fileIndex: 0,
      bottomOpen: bottomDrawer.open
    };
  }

  handleToolsBarOpen = () => {
    this.handleDrawerOpen("bottomOpen")(false);
    this.handleDrawerOpen("bottomOpenSetting")(true);
  }

  handleMinimize = () => {
    remote
      .getCurrentWindow()
      .minimize();
  }

  handleClose = () => {
    remote
      .getCurrentWindow()
      .close();
  }

  render() {
    const {classes, fileL, fileIndex} = this.props;
    const {
      handleDrawerOpen,
      handleSwitchPage,
      handleDirOpen,
      handleRadio,
      handleClickFile,
      bottomOpen
    } = this.props;
    // console.log(bottomOpen);

    return (
      <Drawer
        anchor="bottom"
        open={bottomOpen}
        className={classes.toolsBarPaper}
        handleDrawerOpen={handleDrawerOpen("bottomOpen")}>
        <div>
          <List>
            <ListItem className={classes.toolsBarListItem}>
              <Stepper start={0} count={fileL} steps={fileIndex} onSwitch={handleSwitchPage}/>
            </ListItem>
            <Divider/>
            <ListItem className={classes.toolsBarListItem}>
              {fileL <= 1
                ? null
                : <Button color="primary" onClick={handleDirOpen}>
                  目录
                </Button>}
              <Button color="primary" onClick={handleRadio}>
                语音
              </Button>
              <Button color="primary" onClick={handleClickFile}>
                刷新
              </Button>
              <Button color="primary" onClick={this.handleToolsBarOpen}>
                设置
              </Button>
              <Button color="primary" onClick={this.handleMinimize}>
                最小化
              </Button>
              <Button color="primary" onClick={this.handleClose}>
                退出阅读
              </Button>
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}

const styles = (theme) => {
  return ({
    toolsBarPaper: {
      width: "50%",
      margin: "auto",
      borderWidth: 0,
      textAlign: "center"
    },
    toolsBarListItem: {
      textAlign: "center",
      display: "inline-block"
    }
  });
}

export default withStyles(styles)(Content);