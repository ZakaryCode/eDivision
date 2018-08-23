import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
// import ColorPicker from 'rc-color-picker';
import {Panel as ColorPickerPanel} from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    hasAlpha: PropTypes.bool.isRequired,
    handleMenuBarControl: PropTypes.func.isRequired,
    handleSwitch: PropTypes.func.isRequired
  };
  button = null;

  state = {
    anchorEl: null,
    selectedIndex: 1
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

  handleChange = (e) => {
    const alpha = e.alpha / 100,
      HEX = e.color,
      R = parseInt(HEX.substring(1, 3), 16),
      G = parseInt(HEX.substring(3, 5), 16),
      B = parseInt(HEX.substring(5, 7), 16);
    let color = `rgba(${R},${G},${B},${alpha})`;
    console.log("color", e, e.color, color);
    this
      .props
      .handleSwitch(color);
  }

  render() {
    const {classes, name, value, hasAlpha} = this.props;
    const {anchorEl} = this.state;

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
                  {/* <MenuItem
                    style={{
                    display: "initial",
                    position: "relative",
                    minHeight: 247
                  }}
                    selected={false}
                    classes={{
                    selected: {}
                  }}> */}
                    <ColorPickerPanel
                      enableAlpha={hasAlpha || false}
                      color={value}
                      onChange={this.handleChange}
                      mode="RGB"/>
                  {/* </MenuItem> */}
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
  popper: {
    // display: "flex", position: "fixed!important"
  }
});

export default withStyles(styles)(Content);