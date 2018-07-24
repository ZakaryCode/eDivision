/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import {Paper, Button, withStyles} from "material-ui";

import snack from "../../store/snack";
import InputInfo from "../../components/Input/InputInfo";

const fs = window.require("fs");
const _path_ = window.require("path");
const ipc = window
  .require("electron")
  .ipcRenderer;
const newline = new RegExp("\r|\n|\r\n", 'g');
const multiline = new RegExp("\r+|\n+|\r\n", 'g');

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
      replace: ""
    };
  }

  handleChange = name => (value) => {
    console.log(name, value, value.target);
    if (!value.target) {
      this.setState({[name]: value});
    } else {
      this.setState({[name]: value.target.value});
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
      let oFileData = document
        .getElementById("fileData")
        .innerText;
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

  handleSearch = (lastEnd) => {
    lastEnd = (typeof lastEnd === "number"
      ? lastEnd
      : this.state.lastEnd || 0);
    console.log("lastEnd", lastEnd);
    lastEnd = this.selectText(this.state.search, false, lastEnd);
    this.setState({lastEnd: lastEnd});
    return lastEnd;
  }

  handleSearchAll = () => {
    this.selectText(this.state.search, true);
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
    let range = userSelection.getRangeAt(0),
      replaceE = document.createElement("span");
    replaceE.innerHTML = this.state.replace;
    range.deleteContents();
    range.insertNode(replaceE);
    this.handleSearch();
  }

  handleReplaceAll = () => {
    let input = document.getElementById("fileData"),
      seachDocs = input.querySelectorAll("a");
    seachDocs.forEach((e) => {
      e
        .parentNode
        .removeChild(e);
    });
  }

  selectText = (text, all, lastEnd) => {
    let input = document.getElementById("fileData"),
      range,
      selection = window.getSelection();
    selection.removeAllRanges();
    /*let start=value.indexOf(text,lastEnd),end=start+text.length,
        nStart=value.substring(0,start).split(newline).map((e)=>{return e.length}),nEnd=value.substring(0,end).split(newline).map((e)=>{return e.length}),
        oStart=input.querySelector(`p:nth-child(${nStart.length})`),oEnd=input.querySelector(`p:nth-child(${nEnd.length})`);*/
    if (!window.getSelection) { // firefox, chrome typeof input.selectionStart != "undefined"
      console.error("平台存在错误,不支持该功能!");
    }
    let seachDocs = input.querySelectorAll("a"),
      seachDoc = seachDocs[lastEnd];
    if (!all) {
      if (seachDocs.length === lastEnd) {
        if (!window.confirm("文档已经完成搜索，接下来将从头开始!")) {
          return 0;
        }
        return this.selectText(text, all, 0);
      }
      console.log(seachDocs, seachDoc, lastEnd, seachDoc.getAttribute("href"));
      seachDoc.scrollIntoView({behavior: "smooth", block: "start"});
      range = this.range()(seachDoc);
      selection.addRange(range);
    } else {
      seachDocs.forEach((e, i) => {
        range = this.range()(e);
        console.log(e, i, range);
        selection.addRange(range);
      });
    }
    if (seachDocs.length === 0) {
      alert("没有查询到相关信息!");
      return 0;
    } else {
      lastEnd++;
      return lastEnd;
    }
  }

  handleReplaceRedundantLine = () => {
    // this.setState({fileData: this.state.fileData.replace(multiline,"\n")});
    let input = document.getElementById("fileData"),
    seachDocs = input.querySelectorAll("p[name=emptyvalue]");
    console.log(seachDocs);
    seachDocs.forEach((e) => {
      e
        .parentNode
        .removeChild(e);
    });
  }

  setSearchLabel = (element, label, index) => {
    if (label) 
      element = element.split(label);
    else 
      element = [element];
    let length = element.length,
      retData = element.map((e, i) => {
        return <span>{e} {length === i + 1
            ? null
            : <a
              rel="displayYellow"
              ref={label}
              href={"#" + label + "-" + index + "-" + i}
              key={"#" + label + "-" + index + "-" + i}>{label}</a>}
        </span>;
      });
    if (!length) {
      retData.push(
        <span name="value"><br/></span>
      );
    }
    // console.log(retData, index);
    return retData;
  }

  range = () => {
    if (document.createRange) 
      return (node, start = 0, end = 1, endNode) => {
        var r = document.createRange();
        try {
          r.selectNodeContents(document.getElementById("fileData"));
          // r.setEnd(endNode || node, end); r.setStart(node, start);
          r.selectNode(node);
          // r.setEnd(endNode.firstChild || node.firstChild, end);
          // r.setStart(node.firstChild, start);
        } catch (error) {
          console.log(error);
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
          <Button color="primary" onClick={this.handleReplaceRedundantLine}>
            冗余换行
          </Button>
          <div
            id="fileData"
            contenteditable="true"
            style={{
            position: "relative"
          }}>
            {this
              .state
              .fileData
              .split(newline)
              .map((e, i) => {
                return <p
                  name={e.toString()
                  ? "value"
                  : "emptyvalue"}
                  style={{
                  whiteSpace: "pre-wrap",
                  webkitMarginBefore: 0,
                  webkitMarginAfter: 0
                }}>{this.setSearchLabel(e.toString(), this.state.search, i).map(e => e)}</p>
              })}
          </div>
        </Paper>
        <div className={classes.tools}>
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
      marginBottom: "25%",
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