/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Paper, Button} from '@material-ui/core';

import snack from '../../store/snack';
import InputInfo from "../../components/Input/InputInfo";
import * as R from "../../conf/RegExp";

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
    ipc.send('open-file-dialog');
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on('selected-file', (event, path) => {
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
    ipc.on('selected-directory', (event, path) => {
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
    }
    const {
      file,
      book,
      bookD,
      division,
      divisionD,
      connect,
      connectD,
      directory
    } = this.state;
    console.log(file, directory);
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        ipc.send('open-error-get-file-dialog');
      } else {
        // console.log(book, division, connect, data);
        data = data.split((division || divisionD));
        for (let index = 0; index < data.length; index++) {
          ((index) => {
            const element = data[index];
            let bookName = (book || bookD) + (connect || connectD) + index;
            let e = element.replace(R.redundancy, "");
            console.log("bookName", bookName);
            console.log("bookData", e, !!e);
            if (!!e) {
              fs.writeFile(_path_.resolve(directory, bookName + ".txt"), element, (err) => {
                if (err) {
                  ipc.send('open-error-get-file-dialog');
                } else {
                  console.log(bookName, "写入成功");
                  snack.setMessage(bookName, "写入成功");
                }
              });
            }
          })(index);
        }
      }
    });
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
            分割文件
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