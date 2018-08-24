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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Drawer from "../../components/Drawer";
import snack from '../../store/snack';
import leftDrawer from '../../store/leftDrawer';
import bottomDrawer from '../../store/bottomDrawer';
import bottomDrawerTools from '../../store/bottomDrawerTools';
import bottomDrawerRadio from '../../store/bottomDrawerRadio';
import app from '../../store/app';
import * as R from "../../conf/RegExp";
import * as utils from "../../utils";
import base64 from "../../utils/base64";
import * as md5 from "../../utils/md5";
import ToolsBar from "./MenuTools-Bar";
import ToolsBarSetting from "./MenuTools-BarSetting";
import ToolsBarRadio from "./MenuTools-Radio";

const _fs_ = window.require('fs'),
  _path_ = window.require('path'),
  electron = window.require("electron"),
  remote = electron.remote;
const ipc = electron.ipcRenderer;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let margin;
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
      pageIndex: 0,
      radioIndex: 0,
      radioStatus: false,
      leftOpen: leftDrawer.open,
      bottomOpen: bottomDrawer.open,
      bottomOpenSetting: bottomDrawerTools.open,
      bottomOpenRadio: bottomDrawerRadio.open,
      pageStyles: {
        color: "#000000",
        backgroundColor: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Arial,Verdana,Sans-serif",
        verticalSpacing: 1
      },
      radioControl: {
        URL: "http://api.xfyun.cn/v1/service/v1/tts",
        CONTENT_TYPE: "application/x-www-form-urlencoded; charset=utf-8",
        REAL_IP: "127.0.0.1",
        APPID: "5b680059",
        API_KEY: "258e2e2b381581eed5fa2e7ac07628f7",
        AUF: "audio/L16;rate=16000",
        AUE: "raw",
        VOICE_NAME: "xiaoyan",
        ENGINE_TYPE: "intp65",
        TEXT_TYPE: "text",
        speed: 50,
        volume: 50,
        hasVolume: true,
        pitch: 50,
        isPlaying: false
      },
      CONTENT: {},
      displayMode: 1
    };
    let bookCheck = setTimeout(() => {
      if (window.confirm("当前阅读器未加载文章，是否退出?")) 
        remote.getCurrentWindow().close();
      }
    , 5000);
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
        const title = "阅读器: " + _path_
          .basename(data)
          .split(".")[0];
        remote
          .getCurrentWindow()
          .setTitle(title)
        setState("file", data, this.handleClickFile);
        if (!!data) {
          clearTimeout(bookCheck);
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      const {leftOpen, bottomOpen, bottomOpenSetting, bottomOpenRadio, handleClickFile} = this.state;
      const mode = this.state.displayMode;
      if (leftOpen || bottomOpen || bottomOpenSetting || bottomOpenRadio || handleClickFile) 
        return;
      let pageIndex = this.state.pageIndex,
        pageHeight = this.countLines(1),
        pageScrollHeight = this.countLines(2);
      switch (Number(e.keyCode)) {
        case 37:
          if (mode === 1) {
            if (pageIndex - pageHeight >= 0) {
              pageIndex -= pageHeight;
              setState("pageIndex", pageIndex);
            } else {
              this.handleSwitchPage(0)();
            }
          } else if (mode === 2) {}
          break;
        case 39:
          if (mode === 1) {
            if (pageScrollHeight >= pageHeight * 2 + pageIndex) {
              pageIndex += pageHeight;
              setState("pageIndex", pageIndex);
            } else {
              this.handleSwitchPage(1)();
            }
          } else if (mode === 2) {}
          break;
        default:
          break;
      }
      console.log("pageIndex", this.state.pageIndex);
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
      _fs_.readFile(file, "utf8", (err, data) => {
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
    if (name === "bottomOpenRadio") {
      bottomDrawerRadio.isOpen(open);
    }
  };

  handleMouseMove = i => e => {
    const {BOOK_CATALOG, TOOLS_BAR, TOOLS_BAR_SETTING, TOOLS_BAR_RADIO} = this.state.CONTENT, {leftOpen, bottomOpen, bottomOpenSetting, bottomOpenRadio} = this.state,
      CATALOG = BOOK_CATALOG.children[0].children[0],
      TOOLSBAR = TOOLS_BAR.children[0].children[0],
      TOOLSBARSETTING = TOOLS_BAR_SETTING.children[0].children[0],
      TOOLSBARRADIO = TOOLS_BAR_RADIO.children[0].children[0];
    if (i === 1 && !this.state.handleMenuBarControlCall) {
      console.log(leftOpen, bottomOpen, bottomOpenSetting, bottomOpenRadio, CATALOG.offsetLeft + CATALOG.offsetWidth + 10, e.clientX, TOOLSBAR.offsetTop - TOOLSBAR.offsetHeight - 10, e.clientY);
      if (leftOpen && CATALOG.offsetLeft + CATALOG.offsetWidth + 10 <= e.clientX) {
        this.handleDrawerOpen("leftOpen")(false);
      } else if (bottomOpenSetting && TOOLSBARSETTING.offsetTop >= e.clientY) {
        this.handleDrawerOpen("bottomOpenSetting")(false);
      } else if (bottomOpenRadio && TOOLSBARRADIO.offsetTop >= e.clientY) {
        // this.handleDrawerOpen("bottomOpenRadio")(false);
      }
    } else {
      if (CATALOG.offsetLeft + CATALOG.offsetWidth + 10 > e.clientX && !leftOpen) {
        // console.log("打开目录", CATALOG.offsetLeft + CATALOG.offsetWidth + 10,
        // e.clientX); this.handleDrawerOpen("leftOpen")(true);
      } else if (!bottomOpen && !bottomOpenSetting && !bottomOpenRadio && !leftOpen && TOOLSBAR.offsetTop - 10 < e.clientY) {
        // console.log("打开工具栏", TOOLSBAR.offsetTop - 10, e.clientY);
        this.handleDrawerOpen("bottomOpen")(true);
      } else if (bottomOpen && TOOLSBAR.offsetTop - 10 >= e.clientY) {
        // console.log("关闭工具栏", TOOLSBAR.offsetTop - 10, e.clientY);
        this.handleDrawerOpen("bottomOpen")(false);
      }
    }
  }

  setSearchLabel = (element, label, index, height) => {
    let spanLabel = (element, label, index) => {
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
          : <span>{element
              ? element
              : <br/>}</span>}</p>;
    return null;
  }

  handleInputRef = name => node => {
    if (node && this.state.CONTENT[name] !== node) {
      let CONTENT = this.state.CONTENT;
      CONTENT[name] = node;
      this.setState({
        CONTENT
      }, () => {
        console.log(`handleInputRef ${name}`, this.state.CONTENT[name]);
      });
    }
  }

  handlePageStyle = name => (value) => {
    let pageStyles = this.state.pageStyles;
    pageStyles[name] = value;
    this.setState({pageStyles});
  }

  handleRadioControl = name => (value) => {
    let radioControl = this.state.radioControl;
    radioControl[name] = value;
    this.setState({radioControl});
  }

  handleSwitchPage = flag => (count, callback) => {
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
    this.setState({
      fileIndex: i,
      pageIndex: 0,
      radioIndex: 0
    }, () => {
      if (typeof callback === "function") 
        callback();
      }
    );
  }

  handleMenuBarControl = (open) => {
    console.log("handleMenuBarControl", open);
    setTimeout(() => {
      this.setState({
        handleMenuBarControlCall: !!open
      });
    }, 10);
  }

  handleRadioBar = () => {
    // this.setState({radioStatus: true});
  }

  handleRadio = () => {
    const {fileData, fileIndex, radioIndex, radioControl} = this.state, {URL, AUE, APPID, API_KEY} = radioControl,
      setState = (name, data, s = () => {}) => {
        this.setState({
          [name]: data
        }, s);
      },
      getHeader = () => {
        let curTime = "" + parseInt(new Date().getTime() / 1000, 10),
          param = {
            auf: radioControl.AUF,
            aue: AUE,
            voice_name: radioControl.VOICE_NAME,
            engine_type: radioControl.ENGINE_TYPE,
            text_type: radioControl.TEXT_TYPE,
            speed: radioControl.speed,
            volume: (radioControl.hasVolume
              ? radioControl.volume
              : 0),
            pitch: radioControl.pitch
          },
          paramBase64 = base64.encode(JSON.stringify(param)),
          checkSum = md5.hex_md5(API_KEY + curTime + paramBase64),
          header = {
            'X-CurTime': curTime,
            'X-Param': paramBase64,
            'X-Appid': APPID,
            'X-CheckSum': checkSum,
            'X-Real-Ip': radioControl.REAL_IP,
            'Content-Type': radioControl.CONTENT_TYPE
          }
        return header;
      },
      getBody = () => {
        const paragraphs = (fileData[fileIndex] || "").split(R.newline),
          paragraphsL = paragraphs.length,
          paragraph = (paragraphs[radioIndex] || "").replace(R.redundancy, "");
        let data = {};
        if (paragraphsL < radioIndex) {
          // 本章读完，切换下一章
          this.handleSwitchPage(1)(null, () => {
            setState("radioStatus", true);
          });
        } else if (paragraph) {
          // 段落存在，开始阅读
          data = {
            text: paragraph
          }
          return utils.json2Form(data);
        } else {
          // 段落不存在，切换下一段落
          setState("radioIndex", radioIndex + 1);
          setState("radioStatus", true);
        }
      },
      BODY_TEXT = getBody();
    if (!BODY_TEXT) {
      return;
    }
    // alert(BODY_TEXT);
    ipc.send('get-xfyun-radio', AUE, URL, getHeader(), BODY_TEXT);
    ipc.on("return-xfyun-radio", (event, data) => {
      console.log(event, data);
      let source = audioCtx.createBufferSource(),
        audioData = utils.toArrayBuffer(data);
      audioCtx.decodeAudioData(audioData, function (buffer) {
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.loop = false;
        source.start(0);
        // source.stop(0);
      }, function (e) {
        console.log("Error with decoding audio data" + e.err);
      });
      source.onended = function (event) {
        // 主动停止，跳出 素材
        console.log("audioCtx.onended", event);
        // 阅读完毕，向下跳转
        setState("radioIndex", radioIndex + 1);
        setState("radioStatus", true);
      }
    });
    ipc.on("return-xfyun-radio-error", (event, data) => {
      console.log(event, data);
      ipc.send('open-error-dialog', JSON.stringify(data));
    });
  };

  countLines = (mode = 1) => { // mode: 0=countLines 1=pageHeight 2=scrollHeight
    const {pageStyles} = this.state;
    const {CONTENT, BOOK_CONTENT} = this.state.CONTENT;
    if (!CONTENT || !BOOK_CONTENT) {
      return 0;
    }
    let lh = parseInt((pageStyles.fontSize || 16) + (pageStyles.verticalSpacing || 1), 10),
      h = parseInt(CONTENT.offsetHeight - margin * 2, 10),
      lc = parseInt(h / lh, 10);
    console.log('line count:', lc, 'line-height:', lh, 'height:', h);
    switch (mode) {
      case 0:
        return lc;
      case 1:
        return lc * lh - (pageStyles.verticalSpacing || 1);
      case 2:
        return BOOK_CONTENT.scrollHeight;
      default:
        return lc;
    }
  }

  countRatio = (canvas) => {
    const ctx = canvas.getContext('2d');
    // 屏幕的设备像素比
    const devicePixelRatio = window.devicePixelRatio || 1;
    // 浏览器在渲染canvas之前存储画布信息的像素比
    const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
    console.log("ratio", devicePixelRatio, ctx);
    // canvas的实际渲染倍率
    return devicePixelRatio / backingStoreRatio;
  }

  autoscale = (canvas) => {
    const ratio = this.countRatio(canvas);
    if (1 != ratio) {
      canvas.style.width = canvas.width + 'px';
      canvas.style.height = canvas.height + 'px';
      canvas.width *= ratio;
      canvas.height *= ratio;
      // ctx.scale(ratio, ratio);
    }
    return canvas;
  }

  render() {
    const {classes} = this.props;
    const {fileData, fileIndex} = this.state;
    const {
      leftOpen,
      bottomOpen,
      bottomOpenSetting,
      bottomOpenRadio,
      pageStyles,
      radioControl
    } = this.state;
    const {BOOK_CONTENT} = this.state.CONTENT;
    console.log(leftOpen, bottomOpen, bottomOpenSetting, bottomOpenRadio);
    const BOOK_CONTENT_HEIGHT = this.countLines(1),
      BOOK_CONTENT_SCROLL_HEIGHT = this.countLines(2),
      BookContentDiv = (h) => { // mode: 1=dom 2=canvas
        const mode = this.state.displayMode;
        if (BOOK_CONTENT) {
          const p = (fileData[fileIndex] || "").split(R.newline);
          BOOK_CONTENT.scrollTop = (this.state.pageIndex + BOOK_CONTENT_HEIGHT > BOOK_CONTENT_SCROLL_HEIGHT
            ? Math.floor(BOOK_CONTENT_SCROLL_HEIGHT / BOOK_CONTENT_HEIGHT - 1) * BOOK_CONTENT_HEIGHT
            : this.state.pageIndex);

          if (mode === 1) {
            return p.map((e, i) => this.setSearchLabel(e.toString(), "", i, h));
          } else if (mode === 2) {
            const width = BOOK_CONTENT.offsetWidth,
              height = BOOK_CONTENT.offsetHeight;
            const canvas = document.getElementById('canvas')
            this.autoscale(canvas);
            const ctx = canvas.getContext('2d')

            ctx.clearRect(0, 0, width, height);
            const __fs = pageStyles.fontSize || 16,
              __vs = pageStyles.verticalSpacing || 1,
              __lh = __fs + __vs;
            ctx.font = `${__fs}px ${pageStyles.fontFamily}`;
            ctx.textBaseline = "top";
            let line = 0;
            for (let x = 0; x < p.length; x++) {
              const e1 = p[x];
              let start = 0,
                end = 0;
              console.log(`Paragraph=${x}`, e1);
              for (let y = 0; y < e1.length; y++) {
                const e2 = e1.substring(start, y);
                if (width < ctx.measureText(e2).width || y === e1.length - 1) {
                  let lineStr = e1.substring(start, end);
                  ctx.fillText(lineStr, 0, line * __lh);
                  console.log(`Line=${line}`, line * __lh, ctx.measureText(lineStr).width, lineStr);
                  line++;
                  start = y;
                } else {
                  end = y;
                }
              }
            }
          }
        }
      };
    if (this.state.radioStatus) {
      this.setState({
        radioStatus: false
      }, this.handleRadio);
    }

    return (
      <div
        className={classes.content}
        ref={this.handleInputRef("CONTENT")}
        onClick={this.handleMouseMove(1)}
        onMouseLeave={this.handleMouseMove(0)}
        onMouseMove={this.handleMouseMove(0)}
        onMouseOut={this.handleMouseMove(0)}
        onMouseOver={this.handleMouseMove(0)}
        style={{
        backgroundImage: pageStyles.backgroundImage,
        backgroundColor: pageStyles.backgroundColor || "#FFFFFF"
      }}>
        <div
          id="BOOK_CONTENT"
          className={classes.bookContent}
          ref={this.handleInputRef("BOOK_CONTENT")}
          style={{
          color: pageStyles.color || "#000000",
          fontSize: `${pageStyles.fontSize || 16}px`,
          lineHeight: `${ (pageStyles.fontSize || 16) + (pageStyles.verticalSpacing || 1)}px`,
          fontFamily: pageStyles.fontFamily,
          height: BOOK_CONTENT_HEIGHT
        }}>
          <div id="BOOK_CONTENT_INNER" ref={this.handleInputRef("BOOK_CONTENT_INNER")}>
            {BookContentDiv(BOOK_CONTENT_HEIGHT)}
            <canvas
              id="canvas"
              width={document.body.offsetWidth - margin * 2}
              height={document.body.offsetHeight - margin * 2}></canvas>
          </div>
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
        <div className={classes.toolsBar} ref={this.handleInputRef("TOOLS_BAR")}>
          <ToolsBar
            fileL={fileData.length}
            fileIndex={fileIndex}
            handleSwitchPage={this.handleSwitchPage}
            handleRadio={this.handleRadioBar}
            handleClickFile={this.handleClickFile}
            handleMenuBarControl={this.handleMenuBarControl}
            handleDrawerOpen={this.handleDrawerOpen}
            bottomOpen={bottomOpen}/>
        </div>
        <div
          className={classes.toolsBar}
          ref={this.handleInputRef("TOOLS_BAR_SETTING")}>
          <ToolsBarSetting
            pageStyles={pageStyles}
            handlePageStyle={this.handlePageStyle}
            handleMenuBarControl={this.handleMenuBarControl}
            handleDrawerOpen={this.handleDrawerOpen}
            bottomOpenSetting={bottomOpenSetting}/>
        </div>
        <div className={classes.toolsBar} ref={this.handleInputRef("TOOLS_BAR_RADIO")}>
          <ToolsBarRadio
            fileL={fileData.length}
            fileIndex={fileIndex}
            handleSwitchPage={this.handleSwitchPage}
            radioIndex={this.state.radioIndex}
            radioControl={radioControl}
            handleRadioControl={this.handleRadioControl}
            handleMenuBarControl={this.handleMenuBarControl}
            handleDrawerOpen={this.handleDrawerOpen}
            bottomOpenRadio={bottomOpenRadio}/>
        </div>
      </div>
    );
  }
}

const styles = (theme) => {
  margin = theme.spacing.unit * 3;
  return ({
    content: {
      width: "100%",
      height: "100vh",
      overflow: "hidden"
    },
    bookContent: {
      margin: theme.spacing.unit * 3,
      height: `calc(100% - ${theme.spacing.unit * 6}px)`,
      width: "-webkit-fill-available",
      overflow: "hidden"
    },
    drawerPaper: {
      width: app.drawerWidth,
      height: `calc(100% - ${app.headerHeight}px)`,
      top: app.headerHeight,
      borderWidth: 0
    },
    toolsBar: {
      // overflowY: "visible"
    }
  });
}

export default withStyles(styles)(Content);