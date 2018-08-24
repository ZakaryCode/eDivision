import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    handleMenuBarControl: PropTypes.func.isRequired,
    handleSwitch: PropTypes.func.isRequired
  };
  button = null;

  state = {
    anchorEl: null,
    ListGroup: {
      font: [
        {
          type: "radio",
          name: 'generic-family',
          value: 'generic-family',
          list: [
            {
              name: "Serif",
              value: "Serif"
            }, {
              name: "Sans-serif",
              value: "Sans-serif"
            }, {
              name: "Cursive",
              value: "Cursive"
            }, {
              name: "Fantasy",
              value: "Fantasy"
            }, {
              name: "Monospace",
              value: "Monospace"
            }
          ]
        }, {
          type: "checkbox",
          name: 'family-name',
          value: 'family-name',
          list: [
            {
              name: "Arial",
              value: "Arial"
            }, {
              name: "宋体",
              value: "SimSun"
            }, {
              name: "黑体",
              value: "SimHei"
            }, {
              name: "微软雅黑",
              value: "Microsoft Yahei"
            }, {
              name: "微软正黑体",
              value: "Microsoft JhengHei"
            }, {
              name: "楷体",
              value: "KaiTi"
            }, {
              name: "新宋体",
              value: "NSimSun"
            }, {
              name: "仿宋",
              value: "FangSong"
            }, {
              name: "Times",
              value: "Times"
            }, {
              name: "Courier",
              value: "Courier"
            }, {
              name: "Verdana",
              value: "Verdana"
            }
          ]
        }
      ]
    }
  };

  handleClickListItem = event => {
    this.setState({anchorEl: event.currentTarget});
    this
      .props
      .handleMenuBarControl(!!event.currentTarget);
  };

  handleClose = () => {
    this.setState({anchorEl: null});
    this
      .props
      .handleMenuBarControl(!!null);
  };

  handleSwitch = (value) => {
    this
      .props
      .handleSwitch(value);
    // this.handleClose();
  }

  handleToggle = value => () => {
    const checked = this
      .props
      .value
      .split(',');
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.handleSwitch(newChecked.join(","));
  };

  render() {
    const {classes, name, value} = this.props;
    const {anchorEl} = this.state;

    const checked = value.split(',');

    return (
      <div className={classes.root}>
        <Button
          color="primary"
          onClick={this.handleClickListItem}
          className={classes.button}>
          {name}
        </Button>
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          transition
          disablePortal
          className={classes.popper}>
          {({TransitionProps, placement}) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
              transformOrigin: placement === 'bottom'
                ? 'center top'
                : 'center bottom'
            }}>
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <div
                    style={{
                    display: 'inline-block',
                    maxHeight: 350,
                    minHeight: 300,
                    overflowY: 'scroll'
                  }}>
                    <List className={classes.list}>
                      {this
                        .state
                        .ListGroup
                        .font
                        .map(e1 => (
                          <li key={`section-${e1.value}`} className={classes.listSection}>
                            <ul
                              className={classes.ul}
                              style={{
                              padding: 0
                            }}>
                              <ListSubheader>{e1.name}</ListSubheader>
                              {e1
                                .list
                                .map(e2 => (
                                  <ListItem
                                    key={`item-${e1.value}-${e2.value}`}
                                    onClick={this.handleToggle(e2.value)}
                                    dense
                                    button
                                    disableGutters
                                    className={classes.listItem}>
                                    <Checkbox
                                      checked={checked.indexOf(e2.value) !== -1}
                                      tabIndex={-1}
                                      disableRipple/>
                                    <ListItemText primary={e2.value}/>
                                  </ListItem>
                                ))}
                            </ul>
                          </li>
                        ))}
                    </List>
                  </div>
                  <MenuItem onClick={this.handleClose}>
                    <Typography
                      style={{
                      margin: "auto"
                    }}>确定</Typography>
                  </MenuItem>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flex: 1
  },
  list: {
    width: '100%',
    maxWidth: 360,
    // backgroundColor: theme.palette.background.paper
  },
  popper: {
    // display: "flex", position: "fixed!important"
  }
});

export default withStyles(styles)(Content);