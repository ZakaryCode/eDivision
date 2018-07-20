/**
 * @author zakary
 * @description 内容页
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import {Paper, Button, Checkbox, withStyles} from "material-ui";
import Table, {TableBody, TableCell, TableRow} from "material-ui/Table";

import EnhancedTableHead from "../../components/Table/TableHead.jsx";
import EnhancedTableToolbar from "../../components/Table/TableToolBar.jsx";
import EnhancedTablePagination from "../../components/Table/TablePagination.jsx";

import snack from "../../store/snack";
import InputInfo from "../../components/Input/InputInfo";

const fs = window.require("fs");
const _path_ = window.require("path");
const ipc = window
  .require("electron")
  .ipcRenderer;

const columnData = [
  {
    id: "num",
    numeric: false,
    disablePadding: true,
    label: "编号"
  }, {
    id: "path",
    numeric: true,
    disablePadding: false,
    label: "路径"
  }, {
    id: "filename",
    numeric: true,
    disablePadding: false,
    label: "文件名"
  }, {
    id: "mtime",
    numeric: true,
    disablePadding: false,
    label: "修改时间"
  }, {
    id: "size",
    numeric: true,
    disablePadding: false,
    label: "文件大小"
  }
];

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      division: "------------",
      divisionD: "------------",
      num_count: 20,
      num_countD: 20,
      connect: ".",
      connectD: ".",
      bookD: "未命名",
      list: {
        connect: [".", "-", " "]
      },
      page: 1,
      rowsPerPage: 20,
      order: "asc",
      orderBy: "num",
      files: [],
      books: [],
      selected: [],
      count: 0
    };
  }

  handleChange = name => (value) => {
    // console.log(name, value, value.target.value);
    if (!value.target) {
      this.setState({[name]: value});
      return;
    }
    this.setState({[name]: value.target.value});
  }

  handleInputRef = name => (Input) => {
    this.setState({[name]: Input});
  }

  handleSelectFile = () => {
    this.handleAdd([], [])();
  }

  handleSelectDirectory = () => {
    // console.log(ipc);
    ipc.send("open-directory-dialog");
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };
    ipc.on("selected-directory", function (event, path) {
      console.log(event, path);
      setState("directory", path[0]);
    });
  }

  handleClickDirectory = () => {
    this.handleConnect(this.state.files)();
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    const files = (order === "desc"
      ? this.state.files.sort((a, b) => (b[orderBy] < a[orderBy]
        ? -1
        : 1))
      : this.state.files.sort((a, b) => (a[orderBy] < b[orderBy]
        ? -1
        : 1)));

    this.setState({files, order, orderBy});
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({
        selected: this
          .state
          .files
          .map((n) => n)
      });
      return;
    }
    this.setState({selected: []});
  };

  handleClick = (event, object) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(object);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, object);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1),);
    }

    this.setState({selected: newSelected});
  };

  handleChangePage = (event, page) => {
    this.setState({
      page
    }, this.getList);
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: event.target.value
    }, this.getList);
  };

  handleAdd = (inFiles, inBooks) => () => {
    const getMaxStr = this.getMaxStr;
    ipc.send("open-file-multiSelections-dialog");
    const setState = (name, data) => {
      this.handleChange(name)(data);
    };

    ipc.on("selected-file", function (event, path) {
      console.log(event, path);
      let files = inFiles,
        books = inBooks,
        length = Number(files.length);
      for (let index = 0; index < path.length; index++) {
        ((index) => {
          let element = path[index],
            name = _path_.basename(element),
            pathD = _path_.dirname(element);
          // console.log(element, pathD, name, fs.statSync(element));
          const state = fs.statSync(element);
          for (let i = 0; i < files.length; i++) {
            const e = files[i];
            // console.log(state.ino, e.ino, state.ino === e.ino);
            if (state.ino === e.ino) {
              return;
            }
          }
          files.push({
            num: index + length,
            ino: state.ino,
            path: pathD,
            filename: name,
            state: state
          });
          name = name.split(".");
          name.pop();
          name = name.join(".");
          books.push(name);
        })(index);
      }
      setState("files", files);
      setState("directory", files[0].path);
      let bookF = books[0],
        bookL = books[books.length - 1],
        bookName = getMaxStr(bookF, bookL),
        book = bookName + "[" + bookF.replace(bookName, "") + "-" + bookL.replace(bookName, "") + "]";
      // console.log(bookName); console.log(bookF, bookL);
      setState("book", book);
    });
  }

  handleDelete = () => {
    const selected = this.state.selected;
    this.setState({
      files: this
        .state
        .files
        .filter((object) => {
          // console.log(object, !(selected.indexOf(object) !== -1));
          if (!(selected.indexOf(object) !== -1)) {
            return object;
          }
        }),
      selected: []
    })
  }

  handleConnect = (inFiles) => () => {
    const {
      book,
      bookD,
      division,
      divisionD,
      num_count,
      num_countD,
      directory,
      directoryInput
    } = this.state;
    if (!directory) {
      snack.setMessage("请先选择输出路径!");
      directoryInput.focus();
      return;
    }
    console.log(inFiles, directory);

    let bookName = (book || bookD),
      count = (num_count || num_countD),
      writeFilesOrder = (data, index) => {
        index = Math.ceil(Number(index));
        // console.log(directory, bookName + "." + index + ".txt");
        fs.writeFile(_path_.resolve(directory, bookName + "." + index + ".txt"), data, function (err) {
          if (err) {
            ipc.send("open-error-get-file-dialog");
          } else {
            console.log(bookName + "." + index + ".txt", "写入成功");
            snack.setMessage(bookName + "." + index + ".txt", "写入成功");
          }
        });
      },
      readFilesOrder = (data, arr, index) => {
        // console.log(_path_.resolve(arr[index].path, arr[index].filename));
        try {
          data += "\r\n" + fs.readFileSync(_path_.resolve(arr[index].path, arr[index].filename)) + "\r\n\r\n\r\n\r\n" + (division || divisionD);
        } catch (error) {
          // console.log(error);
          ipc.send("open-error-get-file-dialog");
        }
        index++;
        // console.log(Number(index) === arr.length || !(Number(index) % count), data);
        if (Number(index) === arr.length) {
          data += "   本卷完";
          writeFilesOrder(data, Number(index) / count);
          return data;
        } else if (!(Number(index) % count)) {
          data += "   本卷完";
          writeFilesOrder(data, Number(index) / count);
          return readFilesOrder("", arr, index);
        }
        return readFilesOrder(data, arr, index);
      };
    readFilesOrder("", inFiles, 0);
  }

  isSelected = (e) => this
    .state
    .selected
    .indexOf(e) !== -1;

  getMaxStr = (str1, str2) => {
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
  dateFtt = (fmt, date) => {
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) 
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) 
      if (new RegExp("(" + k + ")").test(fmt)) 
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
          ? (o[k])
          : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }

  render() {
    const {classes} = this.props;
    let list = this.state.list;
    const {files, order, orderBy} = this.state;
    const {selected} = this.state;
    const {rowsPerPage, page} = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, (files || []).length);

    return (
      <div className="content">
        <Paper className={classes.root} elevation={4}>
          <InputInfo
            type="input"
            label="文件"
            helperText="请选择文件"
            inputName="files"
            inputType="text"
            onClick={this.handleSelectFile}
            value={(this.state.files || []).map((e) => {
            return e.filename
          }).join(",")}
            onChange={this.handleChange("files")}
            inputRef={this.handleInputRef("filesInput")}
            style={{
            width: "80%"
          }}/>
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
          }}/><br/>
          <InputInfo
            type="input"
            label="分隔符"
            onChange={this.handleChange("division")}
            inputRef={this.handleInputRef("divisionInput")}
            value={this.state.division}
            inputName="division"
            inputType="text"
            style={{
            width: "50%",
            marginRight: "1em"
          }}/>
          <InputInfo
            type="input"
            label="数量"
            onChange={this.handleChange("num_count")}
            inputRef={this.handleInputRef("num_countInput")}
            value={this.state.num_count}
            inputName="num_count"
            inputType="text"
            style={{
            textAlign: "-webkit-center",
            width: "20%",
            marginRight: "1em"
          }}/>
          <Button color="primary" onClick={this.handleClickDirectory}>
            合并文件
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
            width: "50%",
            marginRight: "1em"
          }}/>
          <InputInfo
            type="menu"
            label="连接符"
            onChange={this.handleChange("connect")}
            inputRef={this.handleInputRef("connectInput")}
            value={this.state.connect}
            inputName="connect"
            inputType="text"
            style={{
            textAlign: "-webkit-center",
            width: "20%",
            marginRight: "1em"
          }}
            list={list
            .connect
            .map((e) => {
              return {
                label: "\"" + e + "\"",
                value: e
              };
            })}/>

          <EnhancedTableToolbar
            title={this.state.title}
            numSelected={selected.length}
            handleCreate={this.handleAdd(this.state.files, this.state.books)}
            handleConnect={this.handleConnect(this.state.selected)}
            handleDelete={this.handleDelete}/>
          <Table className={classes.table}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={files.length}
              columnData={columnData}
              hasCheckBox={!!true}/>
            <TableBody>
              {files
                .slice(0, rowsPerPage - 1)
                .map((n, i) => {
                  const isSelected = this.isSelected(n);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.num}
                      selected={isSelected}>
                      <CustomTableCell
                        padding="checkbox"
                        onClick={(event) => this.handleClick(event, n)}>
                        <Checkbox checked={isSelected}/>
                      </CustomTableCell>
                      <CustomTableCell padding="none">{n.num}</CustomTableCell>
                      <CustomTableCell numeric>{n.path}</CustomTableCell>
                      <CustomTableCell numeric>{n.filename}</CustomTableCell>
                      <CustomTableCell numeric>{this.dateFtt("yyyy-MM-dd hh:mm:ss", n.state.mtime)}</CustomTableCell>
                      <CustomTableCell numeric>{(n.state.size / 1024).toFixed(2)}KB</CustomTableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{
                  height: 49 * emptyRows
                }}></TableRow>
              )}
            </TableBody>
          </Table>
          <EnhancedTablePagination
            count={this.state.count}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}/>
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
        paddingBottom: "1.2em",
        margin: "auto",
        marginBottom: "4%",
        width: "90%",
        minWidth: 700,
        position: "relative"
      }),
    table: {
      minWidth: 700
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.background.default
      }
    }
  }),
  CustomTableCell = withStyles((theme) => ({
    body: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.secondary.contrastText,
      fontSize: 14
    }
  }))(TableCell);

export default withStyles(styles)(Content);