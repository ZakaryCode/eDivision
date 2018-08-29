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
    handleSwitch: PropTypes.func.isRequired,
    listName: PropTypes.string.isRequired
  };
  button = null;

  state = {
    anchorEl: null,
    ListGroup: {
      WIDTH: [
        {
          type: "list",
          name: 'screen-width',
          value: 'screen-width',
          list: [
            {
              name: "50%",
              value: "50%"
            }, {
              name: "75%",
              value: "75%"
            }, {
              name: "100%",
              value: "100%"
            }
          ]
        }
      ],
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
      ],
      AUF: [
        {
          type: "list",
          name: '音频采样率',
          value: 'AUF',
          list: [
            {
              name: "audio/L16;rate=8000",
              value: "audio/L16;rate=8000"
            }, {
              name: "audio/L16;rate=16000",
              value: "audio/L16;rate=16000"
            }
          ]
        }
      ],
      AUE: [
        {
          type: "list",
          name: '音频编码',
          value: 'AUE',
          list: [
            {
              name: "未压缩的pcm或wav格式",
              value: "raw"
            }, {
              name: "mp3格式",
              value: "lame"
            }
          ]
        }
      ],
      VOICE_NAME: [
        {
          type: "list",
          name: '发音人',
          value: 'VOICE_NAME',
          list: [
            {
              name: "晓燕",
              value: "xiaoyan"
            }
          ]
        }
      ],
      ENGINE_TYPE: [
        {
          type: "list",
          name: '引擎类型',
          value: 'ENGINE_TYPE',
          list: [
            {
              name: "普通",
              value: "aisound"
            }, {
              name: "中文",
              value: "intp65"
            }, {
              name: "英文",
              value: "intp65_en"
            }, {
              name: "小语种",
              value: "mtts"
            }, {
              name: "优化",
              value: "x"
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

  handleSwitch = (value, flag = 0) => {
    this
      .props
      .handleSwitch(value);
    if (flag === 1) {
      this.handleClose();
    }
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
    const {classes, name, value, listName} = this.props;
    const {anchorEl} = this.state;

    let checked = null,
      ulStyle = {
        padding: 0
      },
      divStyle = {},
      extraDiv = null;
    if (this.state.ListGroup[listName][0].type === "radio" || this.state.ListGroup[listName][0].type === "checkbox") {
      checked = (value || "").split(',');
      divStyle = {
        overflowY: 'scroll'
      };
      extraDiv = <MenuItem onClick={this.handleClose}>
        <Typography style={{
          margin: "auto"
        }}>确定</Typography>
      </MenuItem>;
    }

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
                    ...divStyle
                  }}>
                    <List className={classes.list} dense={false}>
                      {this
                        .state
                        .ListGroup[listName]
                        .map(e1 => (
                          <li key={`section-${e1.value}`} className={classes.listSection}>
                            <ul className={classes.ul} style={ulStyle}>
                              {(e1.type === "radio" || e1.type === "checkbox")
                                ? <ListSubheader>{e1.name}</ListSubheader>
                                : null}
                              {e1
                                .list
                                .map(e2 => {
                                  if (e1.type === "radio" || e1.type === "checkbox") {
                                    return <ListItem
                                      key={`item-${e1.value}-${e2.value}`}
                                      onClick={this.handleToggle(e2.value)}
                                      dense
                                      button
                                      disableGutters={true}
                                      className={classes.listItem}>
                                      <Checkbox
                                        checked={checked.indexOf(e2.value) !== -1}
                                        tabIndex={-1}
                                        disableRipple/>
                                      <ListItemText primary={e2.name}/>
                                    </ListItem>
                                  } else if (e1.type === "list") {
                                    return <ListItem
                                      key={`item-${e1.value}-${e2.value}`}
                                      onClick={() => this.handleSwitch(e2.value, 1)}
                                      dense={false}
                                      button
                                      disableGutters={false}
                                      className={classes.listItem}>
                                      <ListItemText
                                        primary={e2.name}
                                        style={{
                                        padding: 0
                                      }}/>
                                    </ListItem>
                                  }
                                  return null;
                                })}
                            </ul>
                          </li>
                        ))}
                    </List>
                  </div>
                  {extraDiv}
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
    flex: 1,
    zIndex: 2
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