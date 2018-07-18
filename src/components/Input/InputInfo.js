import React, {Component} from 'react';
import {Manager, Target, Popper} from 'react-popper';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Button, Typography, TextField, InputAdornment, withStyles} from 'material-ui';
import {relative} from 'path';
import {MenuItem, MenuList} from 'material-ui/Menu';

import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Collapse from 'material-ui/transitions/Collapse';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';

import SelectWrapped from "./SelectWrapped";

class InfoInput extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleClose = (event) => {
    if (this.target.contains(event.target)) {
      return;
    }
    this.setState({open: false});
  };

  render() {
    const {
        classes,
        inputName,
        className,
        inputType,
        onChange,
        label,
        ..._else_
      } = this.props, {open} = this.state;

    let setTitle = (p, c, d) => (
      <InputAdornment position={p} className={c}>{d}</InputAdornment>
    );

    console.log(_else_);

    const models = (type, index) => {
      switch (type) {
        case 'input':
          if (!index) {
            return (<TextField
              key='editable'
              name={inputName || '_'}
              fullWidth
              error={false}
              type={inputType || 'text'}
              margin="normal"
              value={this.props.value}
              className={className}
              onChange={onChange}
              InputProps={{
              startAdornment: setTitle("start", classes.inputLabel, this.props.label)
            }}
              {..._else_}/>);
          }
          return (
            <div key='readonly' className={classes.textBox} {..._else_}>
              {setTitle("start", classes.inputLabel, this.props.label)}
              <div>
                <Typography style={{
                  font: 'inherit'
                }}>{this.props.value}
                </Typography>
              </div>
            </div>
          );
        case 'select':
          if (!index) {
            return (<TextField
              key='editable'
              name={inputName}
              fullWidth
              error={false}
              type={inputType || 'text'}
              margin="normal"
              placeholder=""
              value={this.props.value}
              className={className}
              onChange={onChange}
              InputProps={{
              startAdornment: setTitle("start", classes.selectLabel, this.props.label),
              inputComponent: SelectWrapped,
              inputProps: {
                classes,
                multi: false,
                instanceId: inputName,
                id: inputName,
                simpleValue: true,
                options: this.props.list
              }
            }}
              InputLabelProps={{
              shrink: true
            }}
              {..._else_}/>);
          }
          return (
            <div key='readonly' className={classes.selectBox} {..._else_}>
              {setTitle("start", classes.inputLabel, this.props.label)}
              <div>
                <Typography style={{
                  font: 'inherit'
                }}>{this.props.value}
                </Typography>
              </div>
            </div>
          );
        case 'menu':
          if (!index) {
            return (
              <TextField
                key='editable'
                name={inputName}
                fullWidth
                error={false}
                type={inputType || 'text'}
                margin="normal"
                placeholder=""
                value={this.props.value}
                className={className}
                onChange={onChange}
                select
                SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
                InputProps={{
                startAdornment: setTitle("start", classes.inputLabel, this.props.label)
              }}{..._else_}>
                {this
                  .props
                  .list
                  .map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.value}
                      style={{
                        textAlign: "-webkit-center",
                    }}>
                      {option.label}
                    </MenuItem>
                  ))}
              </TextField>
            );
          }
          return (
            <div
              key='readonly'
              className={className
              ? className
              : classes.menuBox}
              {..._else_}>
              {setTitle("start", classes.inputLabel, this.props.label)}
              <div>
                <Typography style={{
                  font: 'inherit'
                }}>{this.props.value}
                </Typography>
              </div>
            </div>
          );
        case 'menu_select':
          if (!index) {
            return (
              <Manager
                key='editable'
                name={inputName}
                className={className}
                onChange={onChange}
                {..._else_}>
                <Target
                  onClick={this.handleToggle}
                  style={{
                  minHeight: 2 + 'em',
                  lineHeight: 2 + 'em'
                }}>
                  <div
                    style={{
                    position: "relative"
                  }}
                    ref={(node) => {
                    this.target = node;
                  }}>
                    <Button
                      aria-owns={open
                      ? 'menu-list-grow'
                      : null}
                      aria-haspopup="true"
                      onClick={this.handleToggle}>
                      {this.props.value}
                    </Button>
                  </div>
                </Target>
                <Popper
                  placement="bottom-start"
                  eventsEnabled={open}
                  className={classNames({
                  [classes.popperClose]: !open
                })}>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <Grow
                      in={open}
                      id="menu-list-grow"
                      style={{
                      transformOrigin: '0 0 0'
                    }}>
                      <Paper>
                        <MenuList role="menu">
                          {this
                            .props
                            .list
                            .map((option, index) => (
                              <MenuItem key={index} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                        </MenuList>
                      </Paper>
                    </Grow>
                  </ClickAwayListener>
                </Popper>
              </Manager>
            );
          }
          return (
            <div key='readonly' className={classes.menuButton} {..._else_}>
              <div>
                <Typography style={{
                  font: 'inherit'
                }}>{this.props.value}
                </Typography>
              </div>
            </div>
          );
        default:
          break;
      }
    };

    return models(this.props.type, Number(!!this.props.readOnly));
  }
}

const styles = (theme) => ({
  inputLabel: {
    width: 4 + 'em',
    flexDirection: 'row', // row-reverse
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  selectLabel: {
    flexDirection: 'row', // row-reverse
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  textBox: {
    paddingTop: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    display: 'flex',
    fontSize: '1rem'
  },
  selectBox: {
    paddingTop: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    // display: 'flex',
    fontSize: '1rem',
    width: 30 + '%',
    display: '-webkit-inline-box',
    overflowX: 'hidden'
  },
  menuBox: {
    paddingTop: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    display: 'flex',
    fontSize: '1rem',
    width: 100 + '%',
    // display: '-webkit-inline-box',
    overflowX: 'hidden'
  },
  menuButton: {
    paddingTop: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(0, 0, 0, 0)',
    display: 'flex',
    fontSize: '1rem',
    width: 100 + '%',
    // display: '-webkit-inline-box',
    overflowX: 'hidden'
  }
});

export default withStyles(styles)(InfoInput);