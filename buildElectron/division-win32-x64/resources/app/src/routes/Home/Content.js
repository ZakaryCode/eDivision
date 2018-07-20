/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Paper, TextField, Button, withStyles} from 'material-ui';

import snack from '../../store/snack';
import InputInfo from "../../components/Input/InputInfo";

const fs = window.require('fs');
const _path_ = window.require('path');
const ipc = window
  .require('electron')
  .ipcRenderer;

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
      search: "",
      replace: ""
    };
  }

  handleChange = name => (value) => {
    // console.log(name, value, value.target.value);
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
    ipc.send('open-file-dialog');
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on('selected-file', function (event, path) {
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
    ipc.send('open-directory-dialog');
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on('selected-directory', function (event, path) {
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
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          ipc.send('open-error-get-file-dialog');
        } else {
          setState("fileData", data);
        }
      });
    }
  }

  handleSaveFile = () => {
    const {
      file,
      book,
      bookD,
      fileData,
      directory,
      directoryInput
    } = this.state;
    if (!directory) {
      snack.setMessage("请先选择输出路径!");
      directoryInput.focus();
      return;
    } else {
      console.log(file, directory);

      let bookName = (book || bookD);
      fs.writeFile(_path_.resolve(directory, bookName + ".txt"), fileData, function (err) {
        if (err) {
          ipc.send('open-error-get-file-dialog');
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

  handleSearch = () => {
    this.selectText(this.state.search);
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
  }

  selectText = (text, all) => {
    let input = this.state.fileDataInput,
      v = input.value,
      start = v.indexOf(text),
      end;
    if (start == -1) 
      return; // 查询失败
    end = start + text.length;
    input.focus();
    let range;
    if (document.selection) { // IE typeof input.createTextRange != 'undefined'
      range = document
        .body
        .createTextRange();
      range.moveToElementText(input); // input.createTextRange();
      // 先将光标重合
      range.moveStart('character', 0);
      range.moveEnd('character', 0);
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
    } else if (window.getSelection) { // firefox, chrome typeof input.selectionStart != 'undefined'
      range = document.createRange();
      range.selectNode(input);
      range.setStart(input, 0);
      range.setEnd(input, 1);
      window
        .getSelection()
        .addRange(range);
      // console.log(input, input.selectionStart, input.selectionEnd, start, end);
      input.selectionStart = start;
      input.selectionEnd = end
      console.log(range, start, end, "innerText-" + document.getElementById("fileData").innerText);
      input.setSelectionRange(start, end);
      console.log(window.getSelection());
    }
  }

  render() {
    const {classes} = this.props;
    let list = this.state.list;

    return (
      <div className="content">
        <Paper className={classes.root} elevation={4}>
          <InputInfo
            type='input'
            label='文件'
            helperText="请选择文件"
            inputName='file'
            inputType='text'
            onClick={this.handleSelectFile}
            value={this.state.file}
            onChange={this.handleChange("file")}
            inputRef={this.handleInputRef("fileInput")}
            style={{
            width: '80%'
          }}/>
          <Button color="primary" onClick={this.handleClickFile}>
            读取文件
          </Button>
          <InputInfo
            type='input'
            label='输出'
            helperText="请选择文件输出路径"
            inputName='directory'
            inputType='text'
            onClick={this.handleSelectDirectory}
            value={this.state.directory}
            onChange={this.handleChange("directory")}
            inputRef={this.handleInputRef("directoryInput")}
            style={{
            width: '80%'
          }}/>
          <Button color="primary" onClick={this.handleSaveFile}>
            保存文件
          </Button>
          <InputInfo
            type='input'
            label='书名'
            onChange={this.handleChange('book')}
            inputRef={this.handleInputRef("bookInput")}
            value={(this.state.book || this.state.bookD) + ".txt"}
            inputName='book'
            inputType='text'
            style={{
            width: '80%'
          }}/>
          <Button color="primary" onClick={this.handleDeleteFile}>
            删除本地文件
          </Button>
          <InputInfo
            type='input'
            label='查询'
            onChange={this.handleChange('search')}
            inputRef={this.handleInputRef("searchInput")}
            value={this.state.search}
            inputName='search'
            inputType='text'
            style={{
            width: '60%'
          }}/>
          <Button color="primary" onClick={this.handleSearch}>
            查询
          </Button>
          <Button color="primary" onClick={this.handleSearchAll}>
            查询所有
          </Button>
          <InputInfo
            type='input'
            label='替换'
            onChange={this.handleChange('replace')}
            inputRef={this.handleInputRef("replaceInput")}
            value={this.state.replace}
            inputName='replace'
            inputType='text'
            style={{
            width: '60%'
          }}/>
          <Button color="primary" onClick={this.handleReplace}>
            替换
          </Button>
          <Button color="primary" onClick={this.handleReplaceAll}>
            替换所有
          </Button>
          <TextField
            id="fileData"
            type='text'
            rows="15"
            value={this.state.fileData}
            onChange={this.handleChange('fileData')}
            inputRef={this.handleInputRef("fileDataInput")}
            className={classes.textField}
            margin="normal"
            multiline
            fullWidth/>
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: theme
    .mixins
    .gutters({
      paddingTop: theme.spacing.unit * 3,
      paddingBottom: '1.2em',
      margin: 'auto',
      marginBottom: '4%',
      width: '90%',
      position: 'relative'
    })
});

export default withStyles(styles)(Content);