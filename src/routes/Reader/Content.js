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
import ColorPicker from '@mapbox/react-colorpickr';

import Drawer from "../../components/Drawer";
import Stepper from "../../components/Stepper";
import snack from '../../store/snack';
import leftDrawer from '../../store/leftDrawer';
import bottomDrawer from '../../store/bottomDrawer';
import bottomDrawerTools from '../../store/bottomDrawerTools';
import app from '../../store/app';
import * as R from "../../conf/RegExp";
import * as utils from "../../utils";

const fs = window.require('fs'),
  // _path_ = window.require('path'),
  electron = window.require("electron"),
  remote = electron.remote;
const ipc = electron.ipcRenderer;

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      division: "------------",
      divisionD: "------------",
      fileData: [],
      fileIndex: 0,
      leftOpen: leftDrawer.open,
      bottomOpen: bottomDrawer.open,
      bottomOpenSetting: bottomDrawerTools.open,
      pageStyles: {
        color: "#000000"
      }
    };
    const setState = (name, data, s = () => {}) => {
        this.setState({
          [name]: data
        }, s);
      },
      getFile = (file) => {
        console.log(!this.state.file, this.state.file !== file, this.state.file, file)
        if (!this.state.file) {
          return 2;
        }
        if (this.state.file !== file) {
          return 1;
        }
        return 0;
      };
    ipc.on('Reader-Path-Send', (event, data) => {
      const i = getFile(data);
      console.log("Reader-Path-Send", i, data);
      if (i === 2 || (i === 1 && window.confirm("是否重载阅读器？"))) {
        setState("file", data, this.handleClickFile);
      }
    });
  }

  handleClickFile = () => {
    const {file, division, divisionD} = this.state,
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
          data = data.split(division || divisionD);
          console.log("fileData", data);
          setState("fileData", data);
        }
      });
    }
  }

  handleDrawerOpen = name => open => {
    console.log("handleDrawerOpen", name, open);
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
    if (name === "bottomOpenSetting") {
      bottomDrawerTools.isOpen(open);
    }
  };

  handleMouseMove = i => e => {
    const {BOOK_CATALOG, TOOLS_BAR, TOOLS_BAR_SETTING} = this, {leftOpen, bottomOpen, bottomOpenSetting} = this.state,
      CATALOG = BOOK_CATALOG.children[0].children[0],
      TOOLSBAR = TOOLS_BAR.children[0].children[0],
      TOOLSBARSETTING = TOOLS_BAR_SETTING.children[0].children[0];
    if (i === 1) {
      console.log(leftOpen, bottomOpen, bottomOpenSetting, CATALOG.offsetLeft + CATALOG.offsetWidth + 10, e.clientX, TOOLSBAR.offsetTop - TOOLSBAR.offsetHeight - 10, e.clientY);
      if (leftOpen && CATALOG.offsetLeft + CATALOG.offsetWidth + 10 <= e.clientX) {
        this.handleDrawerOpen("leftOpen")(false);
      } else if (bottomOpenSetting && TOOLSBARSETTING.offsetTop >= e.clientY) {
        this.handleDrawerOpen("bottomOpenSetting")(false);
      }
    } else {
      if (CATALOG.offsetLeft + CATALOG.offsetWidth + 10 > e.clientX && !leftOpen) {
        // console.log("打开目录", CATALOG.offsetLeft + CATALOG.offsetWidth + 10,
        // e.clientX); this.handleDrawerOpen("leftOpen")(true);
      } else if (!bottomOpen && !bottomOpenSetting && !leftOpen && TOOLSBAR.offsetTop - 10 < e.clientY) {
        // console.log("打开工具栏", TOOLSBAR.offsetTop - 10, e.clientY);
        this.handleDrawerOpen("bottomOpen")(true);
      } else if (bottomOpen && TOOLSBAR.offsetTop - 10 >= e.clientY) {
        // console.log("关闭工具栏", TOOLSBAR.offsetTop - 10, e.clientY);
        this.handleDrawerOpen("bottomOpen")(false);
      }
    }

  }

  handleDirOpen = () => {
    this.handleDrawerOpen("bottomOpen")(false);
    this.handleDrawerOpen("leftOpen")(true);
  }

  handleToolsBarOpen = () => {
    this.handleDrawerOpen("bottomOpen")(false);
    this.handleDrawerOpen("bottomOpenSetting")(true);
  }

  setSearchLabel = (element, label, index) => {
    let spanLabel = () => {
      element = element.split(label);
      if (!element.length) 
        return <span name="value"><br/></span>;
      return element.map((e, i) => {
        if (element.length === i + 1) 
          return <span>{e}</span>;
        return <span>{e}
          <a
            rel="displayYellow"
            ref={label}
            href={"#" + label + "-" + index + "-" + i}
            key={"#" + label + "-" + index + "-" + i}>{label}</a>
        </span>;
      });
    }
    if (index < 5000) 
      return <p
        name={element.replace(R.redundancy, "")
        ? "value"
        : "emptyvalue"}
        style={{
        whiteSpace: "pre-wrap",
        webkitMarginBefore: 0,
        webkitMarginAfter: 0
      }}>{label
          ? spanLabel(element, label, index)
          : <span>{element}</span>}</p>;
    return null;
  }

  handleInputRef = name => node => {
    if (node) {
      // console.log(name, node, node.offsetLeft, node.offsetWidth, node.offsetTop,
      // node.offsetHeight);
      this[name] = node;
    }
  }

  handleSwitchPage = flag => (count) => {
    let i;
    if (flag === 2) {
      i = count;
    } else if (flag === 1) {
      i = this.state.fileIndex + 1;
    } else if (flag === 0) {
      i = this.state.fileIndex - 1;
    }
    if (i === this.state.fileData.length) {
      snack.setMessage("已经是最后一章了!");
      return;
    } else if (i < 0) {
      snack.setMessage("已经是第一章了!");
      return;
    }
    this.setState({fileIndex: i});
  }

  render() {
    const {classes} = this.props, {
        leftOpen,
        bottomOpen,
        bottomOpenSetting,
        fileData,
        fileIndex,
        pageStyles
      } = this.state;
    console.log(leftOpen, bottomOpen, bottomOpenSetting);

    return (
      <div
        className={classes.content}
        onClick={this.handleMouseMove(1)}
        onMouseLeave={this.handleMouseMove(0)}
        onMouseMove={this.handleMouseMove(0)}
        onMouseOut={this.handleMouseMove(0)}
        onMouseOver={this.handleMouseMove(0)}
        ref={this.handleInputRef("CONTENT")}>
        <div
          className={classes.bookContent}
          style={{
          backgroundImage: pageStyles.backgroundImage,
          backgroundColor: pageStyles.backgroundColor || "#FFFFFF",
          color: pageStyles.color || "#000000",
          fontSize: `${pageStyles.fontSize || 16}px`
        }}
          ref={this.handleInputRef("BOOK_CONTENT")}>
          {(fileData[fileIndex] || "").split(R.newline).map((e, i) => this.setSearchLabel(e.toString(), "", i))}
        </div>
        <div className="bookCatalog" ref={this.handleInputRef("BOOK_CATALOG")}>
          <Drawer
            anchor="left"
            open={leftOpen}
            className={classes.drawerPaper}
            handleDrawerOpen={this.handleDrawerOpen("leftOpen")}>
            <div>
              <List>
                {fileData.map((e, i) => {
                  const p = e.split(R.newline);
                  for (let index = 0; index < p.length; index++) {
                    const element = p[index];
                    if (element) {
                      return <ListItem
                        button
                        onClick={() => {
                        this.handleSwitchPage(2)(i);
                        this.handleDrawerOpen("leftOpen")(false);
                      }}>
                        <ListItemText primary={element}/>
                      </ListItem>
                    }
                  }
                })}
              </List>
            </div>
          </Drawer>
        </div>
        <div className="toolsBar" ref={this.handleInputRef("TOOLS_BAR")}>
          <Drawer
            anchor="bottom"
            open={bottomOpen}
            className={classes.toolsBarPaper}
            handleDrawerOpen={this.handleDrawerOpen("bottomOpen")}>
            <div>
              <List>
                <ListItem className={classes.toolsBarListItem}>
                  <Stepper
                    start={0}
                    count={this.state.fileData.length}
                    steps={fileIndex}
                    onSwitch={this.handleSwitchPage}/>
                </ListItem>
                <Divider/>
                <ListItem className={classes.toolsBarListItem}>
                  <Button color="primary" onClick={this.handleDirOpen}>
                    目录
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                    fetch("http://api.xfyun.cn/v1/service/v1/tts", {
                      method: "post",
                      headers: new Headers({"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"}),
                      data: utils.json2Form({
                        "auf": "audio/L16;rate=16000",
                        "aue": "raw",
                        "voice_name": "xiaoyan",
                        "speed": "50",
                        "volume": "50",
                        "pitch": "50",
                        "engine_type": "intp65",
                        "text_type": "text"
                      })
                    }).then((res) => {
                      console.log(res)
                    }).catch((err) => {
                      console.log(err)
                    });
                  }}>
                    语音
                  </Button>
                  <Button color="primary" onClick={this.handleToolsBarOpen}>
                    设置
                  </Button>
                  <Button color="primary" onClick={this.handleClickFile}>
                    刷新
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                    remote
                      .getCurrentWindow()
                      .minimize()
                  }}>
                    最小化
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                    remote
                      .getCurrentWindow()
                      .close()
                  }}>
                    退出阅读
                  </Button>
                </ListItem>
              </List>
            </div>
          </Drawer>
        </div>
        <div className="toolsBar" ref={this.handleInputRef("TOOLS_BAR_SETTING")}>
          <Drawer
            anchor="bottom"
            open={bottomOpenSetting}
            className={classes.toolsBarPaper}
            handleDrawerOpen={this.handleDrawerOpen("bottomOpenSetting")}>
            <div>
              <List>
                <ListItem className={classes.toolsBarListItem}>
                  <Button color="primary" onClick={this.handleClickFile}>
                    设置
                  </Button>
                  <ColorPicker
                    onChange={color => {
                    console.log(color);
                  }}/>
                </ListItem>
                <Divider/>
                <ListItem className={classes.toolsBarListItem}>
                  <Button color="primary" onClick={this.handleClickFile}>
                    设置
                  </Button>
                </ListItem>
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
    height: "100vh"
  },
  bookContent: {
    padding: theme.spacing.unit * 3
  },
  drawerPaper: {
    width: app.drawerWidth,
    height: `calc(100%-${app.headerHeight})`,
    top: app.headerHeight,
    borderWidth: 0
  },
  toolsBarPaper: {
    width: "50%",
    margin: "auto",
    borderWidth: 0,
    textAlign: "center"
  },
  toolsBarListItem: {
    textAlign: "center",
    display: "block"
  }
})

export default withStyles(styles)(Content);