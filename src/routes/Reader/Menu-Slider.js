import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Slider from '@material-ui/lab/Slider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    parentItemStyle: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
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

  render() {
    const {
      classes,
      name,
      max,
      min,
      value,
      handleSwitch,
      children
    } = this.props;
    const {anchorEl} = this.state;
    const parentItemStyles = React
      .Children
      .map(children, child => child.props.parentItemStyle) || [];
    let parentItemStyle = {};
    parentItemStyles.forEach(e => {
      parentItemStyle = {
        parentItemStyle,
        ...e
      }
    });
    console.log(name, children, ...parentItemStyle);

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
                  <MenuItem
                    style={{
                    display: 'flex',
                    minHeight: 300,
                    ...parentItemStyle
                  }}>
                    <Slider
                      max={max}
                      min={min}
                      step={1}
                      value={value}
                      onChange={handleSwitch}
                      vertical
                      reverse
                      style={{
                      display: 'flex',
                      minHeight: 300
                    }}/> {React
                      .Children
                      .map(children, child => child)}
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