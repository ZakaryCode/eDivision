/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Paper, Button, withStyles} from 'material-ui';

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
      division: "------------",
      divisionD: "------------",
      connect: ".",
      connectD: ".",
      bookD: "未命名",
      list: {
        connect: [".", "-", " "]
      }
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
    ipc.send('open-file-multiSelections-dialog');
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on('selected-file', function (event, path) {
      console.log(event, path);
      let files = [],
        books = [];
      for (let index = 0; index < path.length; index++) {
        ((index) => {
          let element = path[index],
            name = _path_.basename(element);
          console.log(element, name);
          files.push(element);
          name = name.split(".");
          name.pop();
          name = name.join(".");
          books.push(name);
        })(index);
      }
      setState("files", files);
      setState("directory", _path_.dirname(path[0]));
      let bookF = books[0],
        bookL = books[books.length - 1],
        bookName = getMaxStr(bookF, bookL),
        book = bookName + "[" + bookF.replace(bookName, "") + "-" + bookL.replace(bookName, "") + "]";
      // console.log(bookName); console.log(bookF, bookL);
      setState("book", book);
    });

    let getMaxStr = (str1, str2) => {
      var max = str1.length > str2.length
        ? str1
        : str2;
      var min = (max == str1
        ? str2
        : str1);
      for (var i = 0; i < min.length; i++) {
        for (var x = 0, y = min.length - i; y != min.length + 1; x++, y++) {
          //y表示所取字符串的长度
          var newStr = min.substring(x, y);
          //判断max中是否包含newStr
          if (max.indexOf(newStr) != -1) {
            return newStr;
          }
        }
      }
      return -1;
    }
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

  handleClickDirectory = () => {
    if (!this.state.directory) {
      snack.setMessage("请先选择输出路径!");
      this
        .state
        .directoryInput
        .focus();
      return;
    } else {
      const {
        files,
        book,
        bookD,
        division,
        divisionD,
        directory
      } = this.state;
      console.log(files, directory);

      let fileData = "",
        readFilesOrder = (data, arr, index) => {
          try {
            data += "\r\n" + fs.readFileSync(arr[index]) + "\r\n\r\n\r\n\r\n" + (division || divisionD);
          } catch (error) {
            ipc.send('open-error-get-file-dialog');
          }
          index++;
          if (Number(index) === arr.length) {
            data += "   本卷完";
            return data;
          } else {
            return readFilesOrder(data, arr, index);
          }
        };
      fileData = readFilesOrder(fileData, files, 0);
      console.log(fileData);
      let bookName = (book || bookD);
      fs.writeFile(_path_.resolve(directory, bookName + ".txt"), fileData, function (err) {
        if (err) {
          ipc.send('open-error-get-file-dialog');
        } else {
          console.log(bookName, "写入成功");
        }
      });
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
            inputName='files'
            inputType='text'
            onClick={this.handleSelectFile}
            value={(this.state.files || []).join(",")}
            onChange={this.handleChange("files")}
            inputRef={this.handleInputRef("filesInput")}
            style={{
            width: '80%'
          }}/>
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
          }}/><br/>
          <InputInfo
            type='input'
            label='分隔符'
            onChange={this.handleChange('division')}
            inputRef={this.handleInputRef("divisionInput")}
            value={this.state.division}
            inputName='division'
            inputType='text'
            style={{
            width: '80%'
          }}/>
          <Button color="primary" onClick={this.handleClickDirectory}>
            合并文件
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
            width: '40%',
            marginRight: "1em"
          }}/>
          <InputInfo
            type='menu'
            label='连接符'
            onChange={this.handleChange('connect')}
            inputRef={this.handleInputRef("connectInput")}
            value={this.state.connect}
            inputName='connect'
            inputType='text'
            style={{
            textAlign: "-webkit-center",
            width: "10em"
          }}
            list={list
            .connect
            .map((e) => {
              return {
                label: "\"" + e + "\"",
                value: e
              };
            })}/>
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