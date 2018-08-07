import React, {Component} from "react";
import PropTypes from "prop-types";
import {Avatar, Button, TextField, Typography, withStyles} from "material-ui";
import {List, ListItem, ListItemAvatar, ListItemText} from "material-ui";
import {DialogTitle, DialogActions, DialogContent, DialogContentText, Dialog} from "material-ui";

import AddIcon from 'material-ui-icons/Add';
import blue from 'material-ui/colors/blue';

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onAdd: PropTypes.func,
    onClose: PropTypes.func,
    arrayMap: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      addValue: ""
    };
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
  
  handleClose = (e) => {
    this
      .props
      .onClose(!!e);
  };

  handleAddOption = () => {
    this
      .props
      .onAdd(this.state.addValue, true);
    this.setState({addValue: ""});
  }

  handleRemoveOption = (value) => {
    this
      .props
      .onAdd(value, false);
  }

  render() {
    const {
      classes,
      onClose,
      arrayMap,
      selectedValue,
      ...other
    } = this.props;

    return (
      <Dialog
        onClose={() => this.handleClose(false)}
        aria-labelledby="simple-dialog-title"
        {...other}>
        <DialogTitle id="simple-dialog-title">配置文件</DialogTitle>
        <DialogContent>
          <DialogContentText style={{
            textIndent: "2em"
          }}>
            在这里可以配置本地的配置文件，然后点击“替换”按钮，可以直接全局替换所有的配置项目。
          </DialogContentText>
          <List>
            {arrayMap.map((value, index) => (
              <ListItem
                button
                onClick={() => {
                if (window.confirm("是否确认删除?")) {
                  this.handleRemoveOption(value);
                  return;
                }
              }}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <Typography className={classes.text}>{Number(index) + 1}</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={value}/>
              </ListItem>
            ))}
            <ListItem>
              <ListItemAvatar button onClick={() => this.handleAddOption()}>
                <Avatar>
                  <AddIcon/>
                </Avatar>
              </ListItemAvatar>
              <TextField
                autoFocus
                margin="dense"
                id="add"
                label="添加配置项"
                value={this.state.addValue}
                onChange={this.handleChange("addValue")}
                style={{
                marginLeft: "1em"
              }}
                fullWidth/>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
            this.handleClose(false);
          }}>
            取消
          </Button>
          <Button
            color="primary"
            onClick={() => {
            this.handleClose(true);
          }}>
            替换
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  avatar: {
    backgroundColor: blue[100]
  },
  text: {
    color: blue[600]
  }
});

export default withStyles(styles)(Content);