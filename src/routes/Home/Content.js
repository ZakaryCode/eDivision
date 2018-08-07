/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import {Paper, Button, withStyles} from "material-ui";

import snack from "../../store/snack";
import InputInfo from "../../components/Input/InputInfo";

import DialogBoard from "./Dialog";
import * as R from "../../conf/RegExp";

const fs = window.require("fs"),
  _path_ = window.require("path"),
  electron = window.require("electron"),
  remote = electron.remote,
  ipc = electron.ipcRenderer,
  BrowserWindow = remote.BrowserWindow;

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      fileData: "",
      division: "------------",
      divisionD: "------------",
      connect: ".",
      connectD: ".",
      bookD: "未命名",
      list: {
        connect: [".", "-", " "]
      },
      lastEnd: 0,
      search: "",
      replace: "",
      open: false,
      configure: _path_.join(window.__dirname, '../../../CONIF.json'),
      configureD: _path_.join(window.__dirname, '../../../CONIF.json'),
      arrayMap: []
    };

    const file = this.state.configure || this.state.configureD;
    fs.exists(file, (exists) => {
      console.log(exists)
      if (!exists) {
        let arr = this.state.arrayMap;
        arr = JSON.stringify(arr);
        fs.writeFile(file, arr, function (err) {
          if (err) {
            ipc.send("open-error-get-file-dialog");
          } else {
            console.log(file, "写入成功");
            snack.setMessage(file, "写入成功");
          }
        });
      }
    });
  }

  handleChange = name => (value) => {
    console.log(name, value, value.target);
    if (!value.target) {
      this.setState({[name]: value});
    } else {
      console.log(value.target.value || value.target.innerText);
      this.setState({
        [name]: value.target.value || value.target.innerText
      });
    }
  }

  handleInputRef = name => (Input) => {
    this.setState({[name]: Input});
  }

  handleSelectFile = () => {
    console.log(ipc);
    ipc.send("open-file-dialog");
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on("selected-file", function (event, path) {
      console.log(event, path);
      let __path = path[0],
        __name = _path_.basename(path[0]);
      console.log(__path, __name);
      setState("file", __path);
      setState("directory", _path_.dirname(__path));
      __name = __name.split(".");
      __name.pop();
      __name = __name.join(".");
      setState("book", __name);
    });
  }

  handleSelectDirectory = () => {
    console.log(ipc);
    ipc.send("open-directory-dialog");
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on("selected-directory", function (event, path) {
      console.log(event, path);
      setState("directory", path[0]);
    });
  }

  handleSelectConfigure = () => {
    console.log(ipc);
    ipc.send("open-directory-dialog");
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on("selected-directory", function (event, path) {
      console.log(event, path);
      setState("configure", path[0]);
    });
  }

  handleClickFile = () => {
    const {file, fileInput} = this.state;
    if (!file) {
      snack.setMessage("请先选择文件!");
      fileInput.focus();
      return;
    } else {
      console.log(file);
      const setState = (name, data) => {
        this.handleChange(name)(data);
      };
      fs.readFile(file, "utf8", function (err, data) {
        if (err) {
          ipc.send("open-error-get-file-dialog");
        } else {
          setState("fileData", data);
        }
      });
    }
  }

  handleSaveFile = () => {
    const {file, book, bookD, directory, directoryInput} = this.state;
    if (!directory) {
      snack.setMessage("请先选择输出路径!");
      directoryInput.focus();
      return;
    } else {
      // let oFileData = document.getElementById("fileData").innerText;
      let oFileData = this.state.fileData;
      console.log(file, directory, oFileData);

      let bookName = (book || bookD);
      fs.writeFile(_path_.resolve(directory, bookName + ".txt"), oFileData, function (err) {
        if (err) {
          ipc.send("open-error-get-file-dialog");
        } else {
          console.log(bookName, "写入成功");
          snack.setMessage(bookName, "写入成功");
        }
      });
    }
  }

  handleDialogBoardClose = (flag) => {
    this.setState({open: false});
    const file = this.state.configure || this.state.configureD;
    let arr = this.state.arrayMap;
    arr = JSON.stringify(arr);
    fs.writeFile(file, arr, function (err) {
      if (err) {
        ipc.send("open-error-get-file-dialog");
      } else {
        console.log(file, "写入成功");
        snack.setMessage(file, "写入成功");
      }
    });
    if (flag) {
      console.log(this.state.arrayMap);
      let str = this.state.fileData,
        arrS = this
          .state
          .arrayMap
          .map((e) => e.replace(R.s, e => `\\${e}`))
          .join("|"),
        __regexp = new RegExp(arrS, "g");
      str = str.replace(__regexp, "");
      console.log(arrS, __regexp);
      this.setState({
        fileData: str
      }, () => {
        console.log(this.state.fileData)
      });
    }
  };

  handleReadMode = () => {
    const modalPath = _path_.join('file://', __dirname, '../../sections/windows/modal-toggle-visibility.html');
    let win = new BrowserWindow({width: 600, height: 400, fullscreen: true, frame: true});
    win.on('focus', hideFocusBtn);
    win.on('blur', showFocusBtn);
    win.on('close', function () {
      hideFocusBtn();
      win = null;
    })
    win.loadURL(modalPath);
    win.show();
    function showFocusBtn(btn) {
      if (!win) 
        return
        // focusModalBtn.addEventListener('click', clickHandler)
      }
    function hideFocusBtn() {
      // focusModalBtn.removeEventListener('click', clickHandler)
    }
    function clickHandler() {
      win.focus()
    }
  }

  handleDeleteFile = () => {
    const {file, fileInput} = this.state;
    if (!file) {
      snack.setMessage("请先选择文件!");
      fileInput.focus();
      return;
    } else {
      console.log(file);

      fs.unlink(file, (err) => {
        console.log(err);
        snack.setMessage(file + " - 删除成功!");
      });
    }
  }

  handleSearch = (s, lastEnd) => {
    lastEnd = (typeof lastEnd === "number"
      ? lastEnd
      : this.state.lastEnd || 0);
    console.log("lastEnd", lastEnd);
    lastEnd = this.selectText(this.state.search.replace(s, e => `\\${e}`), false, lastEnd, s); // .replace(spacing, /\s/)
    this.setState({lastEnd: lastEnd});
    return lastEnd;
  }

  handleSearchAll = () => {
    this.selectText(this.state.search.replace(R.s, e => `\\${e}`), true); // .replace(spacing, /\s/)
  }

  handleReplace = () => {
    console.log(this.state.replace);
    var userSelection;
    if (window.getSelection) {
      // 现代浏览器
      userSelection = window.getSelection();
    } else if (document.selection) {
      // IE浏览器
      userSelection = document
        .selection
        .createRange();
    }
    try {
      let search = this
          .state
          .search
          .replace(R.s, e => `\\${e}`), // .replace(spacing, /\s/)
        replace = this.state.replace,
        fileData = this.state.fileData,
        range = userSelection.getRangeAt(0),
        key = range
          .commonAncestorContainer
          .querySelector("a")
          .getAttribute("href")
          .split("-");
      // console.log(key);
      this.setState({
        fileData: fileData
          .split(R.newline)
          .map((e, i) => e.split(search).map((ee, ii, arr) => {
            if (arr.length === ii + 1) 
              return ee;
            return ee + (i === Number(key[1]) && ii === Number(key[2])
              ? replace
              : search)
          }).join(""))
          .join("\n")
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.handleSearch(true);
    }
    // replaceE=document.createElement("span");replaceE.innerHTML=
    // this.state.replace;range.deleteContents();range.insertNode(replaceE);
  }

  handleReplaceAll = () => {
    // let input=
    // document.getElementById("fileData"),seachDocs=input.querySelectorAll("a");
    // seachDocs.forEach((e)=>{e.parentNode.removeChild(e);});
    this.setState({
      fileData: this
        .state
        .fileData
        .replace(new RegExp(this.state.replace.replace(R.s, e => `\\${e}`), "g"), this.state.replace) // .replace(spacing, /\s/)
    });
  }

  selectText = (text, all, lastEnd, s) => {
    let input = document.getElementById("fileData"),
      range,
      selection = window.getSelection();
    selection.removeAllRanges();
    if (!window.getSelection) { // firefox, chrome typeof input.selectionStart != "undefined"
      console.error("平台存在错误,不支持该功能!");
      return 0;
    }
    let seachDocs = input.querySelectorAll("a"),
      seachDoc = seachDocs[(lastEnd > seachDocs.length
          ? seachDocs.length
          : lastEnd)]
    if (!all) {
      if (seachDocs.length === lastEnd) {
        if (!window.confirm("文档已经完成搜索，接下来将从头开始!")) {
          return 0;
        }
        return this.selectText(text, all, 0, s);
      }
      console.log(seachDocs, seachDoc, lastEnd, seachDoc.getAttribute("href"));
      seachDoc.scrollIntoView({behavior: "smooth", block: "start"});
      range = this.range(1)(seachDoc);
      selection.addRange(range);
    } else {
      seachDocs.forEach((e, i) => {
        range = this.range(1)(e);
        console.log(e, i, range);
        selection.addRange(range);
      });
    }
    if (seachDocs.length === 0) {
      alert("没有查询到相关信息!");
      return 0;
    }
    if (!s) 
      lastEnd++;
    return lastEnd;
  }

  selectRegExp = (R, lastEnd, lastStr) => {
    let input = document.getElementById("fileData"),
      value = input.innerText,
      range,
      selection = window.getSelection();
    selection.removeAllRanges();
    if (!window.getSelection) { // firefox, chrome typeof input.selectionStart != "undefined"
      console.error("平台存在错误,不支持该功能!");
      return {sLastEnd: 0, sLastStr: 0};
    }
    let strs = value.match(R) || [],
      str = strs[(lastEnd > strs.length
          ? strs.length
          : lastEnd)] || "",
      start = value.indexOf(str, lastStr),
      end = start + str.length,
      nStart = value
        .substring(0, start)
        .split(R.newline)
        .map((e) => {
          return e.length
        }),
      nEnd = value
        .substring(0, end)
        .split(R.newline)
        .map((e) => {
          return e.length
        }),
      oStart = input.querySelector(`p:nth-child(${nStart.length}) span`),
      oEnd = input.querySelector(`p:nth-child(${nEnd.length}) span`);
    if (start === -1 || !strs.length || !str.length) {
      if (lastEnd === 0) {
        alert("没有查询到相关信息!");
        return {sLastEnd: 0, sLastStr: 0};
      } else {
        if (!window.confirm("文档已经完成搜索，接下来将从头开始!")) {
          return {sLastEnd: 0, sLastStr: 0};
        }
        return this.selectRegExp(R, 0, 0);
      }
    }
    lastEnd++;
    lastStr = end;
    console.log(strs, str, "lastEnd", lastEnd, "lastStr", lastStr);
    console.log(start, nStart, oStart.firstChild);
    console.log(end, nEnd, oEnd.firstChild);
    // console.log(seachDocs, seachDoc, lastEnd, seachDoc.getAttribute("href"));
    oStart.scrollIntoView({behavior: "smooth", block: "start"});
    range = this.range(2)(oStart, nStart[nStart.length - 1], nEnd[nEnd.length - 1], oEnd);
    selection.addRange(range);
    return {sLastEnd: lastEnd, sLastStr: lastStr};
  }

  handleReplaceRedundantLine = () => {
    this.setState({
      fileData: this
        .state
        .fileData
        .replace(R.multiline, "\n")
        .replace(R.emptyEnd, "")
    });
    /* let input=document.getElementById("fileData"),seachDocs=input.querySelectorAll("p[name=emptyvalue]");
    seachDocs.forEach((e)=>{e.parentNode.removeChild(e);}); */
  }

  handleReplaceParentheses = () => {
    this.setState({
      fileData: this
        .state
        .fileData
        .replace(R.parentheses, "")
    });
  }

  handleReplaceBracket = () => {
    this.setState({
      fileData: this
        .state
        .fileData
        .replace(R.bracket, "")
    });
  }

  handleReplaceBraces = () => {
    this.setState({
      fileData: this
        .state
        .fileData
        .replace(R.braces, "")
    });
  }

  handleReplaceSpecialCharacter1 = () => {
    this.setState({
      fileData: this
        .state
        .fileData
        .replace(R.SpecialCharacter1, "")
    });
  }

  handleReplaceHtmlB = () => {
    this.setState({
      fileData: this
        .state
        .fileData
        .replace(R.htmlB, "")
    });
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

  range = (type) => {
    if (document.createRange) 
      return (node, start = 0, end = 1, endNode) => {
        var r = document.createRange();
        try {
          r.selectNodeContents(document.getElementById("fileData"));
          // r.setEnd(endNode || node, end); r.setStart(node, start);
          if (type === 1) {
            r.selectNode(node);
          } else if (type === 2) {
            let nEnd = endNode.firstChild || node.firstChild,
              nStart = node.firstChild;
            r.setEnd(nEnd, end > nEnd.length
              ? nEnd.length
              : end);
            r.setStart(nStart, start > nStart.length
              ? nStart.length
              : start);
          } else if (type === 3) {
            let nStart = node.firstChild;
            r.setStart(nStart, start > nStart.length
              ? nStart.length
              : start);
            r.collapse(true);
          }
        } catch (error) {
          r.collapse(true);
          console.log(endNode.firstChild || node.firstChild, node.firstChild, error);
        } finally {
          return r;
        }
      };
    else 
      return (node, start, end) => {
        var r = document
          .body
          .createTextRange();
        try {
          r.moveToElementText(node.parentNode);
        } catch (e) {
          return r;
        }
        r.collapse(true);
        r.moveEnd("character", end);
        r.moveStart("character", start);
        return r;
      };
  }

  handleConfigure = () => {
    const setState = (name, data) => {
        this.handleChange(name)(data);
      },
      readF = () => fs.readFile(file, "utf8", function (err, data) {
        if (err) {
          ipc.send("open-error-get-file-dialog");
        } else {
          console.log(data);
          setState("arrayMap", JSON.parse(data));
          setState("open", true);
        }
      });
    const file = this.state.configure || this.state.configureD;
    fs.exists(file, (exists) => {
      console.log(exists);
      if (!exists) {
        fs
          .writeFile(file, this.state.arrayMap, function (err) {
            if (err) {
              ipc.send("open-error-get-file-dialog");
            } else {
              console.log(file, "写入成功");
              snack.setMessage(file, "写入成功");
              readF();
            }
          });
      } else {
        readF();
      }
    });
  }

  render() {
    const {classes} = this.props;
    // let list = this.state.list; console.log(this.state.fileData);

    return (
      <div className="content">
        <Paper className={classes.root} elevation={4}>
          <InputInfo
            type="input"
            label="文件"
            helperText="请选择文件"
            inputName="file"
            inputType="text"
            onClick={this.handleSelectFile}
            value={this.state.file}
            onChange={this.handleChange("file")}
            inputRef={this.handleInputRef("fileInput")}
            style={{
            width: "80%"
          }}/>
          <Button color="primary" onClick={this.handleClickFile}>
            读取文件
          </Button>
          <InputInfo
            type="input"
            label="输出"
            helperText="请选择文件输出路径"
            inputName="directory"
            inputType="text"
            onClick={this.handleSelectDirectory}
            value={this.state.directory}
            onChange={this.handleChange("directory")}
            inputRef={this.handleInputRef("directoryInput")}
            style={{
            width: "80%"
          }}/>
          <Button color="primary" onClick={this.handleSaveFile}>
            保存文件
          </Button>
          <InputInfo
            type="input"
            label="配置"
            helperText="配置文件路径"
            inputName="configure"
            inputType="text"
            onClick={this.handleSelectConfigure}
            value={this.state.configure}
            onChange={this.handleChange("configure")}
            inputRef={this.handleInputRef("configureInput")}
            style={{
            width: "80%"
          }}/>
          <DialogBoard
            open={this.state.open}
            onAdd={(e, flag) => {
            let arr = this.state.arrayMap;
            if (flag && arr.indexOf(e) === -1) 
              arr.push(e);
            else if (!flag && arr.indexOf(e) !== -1) 
              arr.splice(arr.indexOf(e), 1);
            this.setState({arrayMap: arr})
          }}
            onClose={this.handleDialogBoardClose}
            arrayMap={this.state.arrayMap}/>
          <Button color="primary" onClick={this.handleConfigure}>
            替换配置
          </Button>
          <InputInfo
            type="input"
            label="书名"
            onChange={this.handleChange("book")}
            inputRef={this.handleInputRef("bookInput")}
            value={(this.state.book || this.state.bookD) + ".txt"}
            inputName="book"
            inputType="text"
            style={{
            width: "80%"
          }}/>
          <Button color="primary" onClick={this.handleDeleteFile}>
            删除本地文件
          </Button>
          <div
            id="fileData"
            contenteditable="true"
            onInput={this.handleChange("fileData")}
            style={{
            position: "relative"
          }}>
            {(this.state.fileData || "").split(R.newline).map((e, i) => this.setSearchLabel(e.toString(), this.state.search.replace(R.s, e => `\\${e}`), i))}
          </div>
        </Paper>
        <div style={{
          height: "15em"
        }}></div>
        <div className={classes.tools}>
          <Button color="primary" onClick={this.handleConfigure}>
            替换配置
          </Button>
          <Button color="primary" onClick={this.handleReplaceRedundantLine}>
            冗余换行
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.empty, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            空格匹配
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.parentheses, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            圆括号匹配
          </Button>
          <Button color="primary" onClick={this.handleReplaceParentheses}>
            圆括号替换
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.bracket, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            方括号匹配
          </Button>
          <Button color="primary" onClick={this.handleReplaceBracket}>
            方括号替换
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.braces, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            大括号匹配
          </Button>
          <Button color="primary" onClick={this.handleReplaceBraces}>
            大括号替换
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.SpecialCharacter1, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            特殊字符1匹配
          </Button>
          <Button color="primary" onClick={this.handleReplaceSpecialCharacter1}>
            特殊字符1替换
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.InternetURL2, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            网页匹配
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.htmlA, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            标签匹配1
          </Button>
          <Button
            color="primary"
            onClick={(lastEnd, lastStr) => {
            lastEnd = (typeof lastEnd === "number"
              ? lastEnd
              : this.state.lastEnd || 0);
            lastStr = (typeof lastStr === "number"
              ? lastStr
              : this.state.lastStr || 0);
            let {sLastEnd, sLastStr} = this.selectRegExp(R.htmlB, lastEnd, lastStr);
            this.setState({lastEnd: sLastEnd, lastStr: sLastStr});
          }}>
            标签匹配2
          </Button>
          <Button color="primary" onClick={this.handleReplaceHtmlB}>
            标签替换2
          </Button>
          <Button color="primary" onClick={this.handleSaveFile}>
            保存文件
          </Button>
          <Button color="primary" onClick={this.handleReadMode}>
            阅读模式
          </Button>
          <InputInfo
            type="input"
            label="查询"
            onChange={this.handleChange("search")}
            inputRef={this.handleInputRef("searchInput")}
            value={this.state.search}
            inputName="search"
            inputType="text"
            style={{
            width: "70%"
          }}/>
          <Button color="primary" onClick={this.handleSearch}>
            查询
          </Button>
          <Button color="primary" onClick={this.handleSearchAll}>
            查询所有
          </Button>
          <InputInfo
            type="input"
            label="替换"
            onChange={this.handleChange("replace")}
            inputRef={this.handleInputRef("replaceInput")}
            value={this.state.replace}
            inputName="replace"
            inputType="text"
            style={{
            width: "70%"
          }}/>
          <Button color="primary" onClick={this.handleReplace}>
            替换
          </Button>
          <Button color="primary" onClick={this.handleReplaceAll}>
            替换所有
          </Button>
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: theme
    .mixins
    .gutters({
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: "1.2em",
      margin: "auto",
      // marginBottom: "30%",
      width: "90%",
      position: "relative",
      minHeight: "-webkit-fill-available"
    }),
  tools: {
    position: "fixed",
    backgroundColor: "#FFFFFF",
    width: "-webkit-fill-available",
    borderTop: "1px #999999 solid",
    padding: theme.spacing.unit * 3,
    bottom: 0,
    textAlign: "-webkit-center"
  }
});

export default withStyles(styles)(Content);