import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    handleMenuBarControl: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
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

  handleSwitch = (value) => {
    this
      .props
      .handleSwitch(value);
    this.handleClose();
  }

  render() {
    const {classes, name} = this.props;
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
                  <MenuItem onClick={() => this.handleSwitch("serif")}>serif</MenuItem>
                  <MenuItem onClick={() => this.handleSwitch("sans-serif")}>sans-serif</MenuItem>
                  <MenuItem onClick={() => this.handleSwitch("cursive")}>cursive</MenuItem>
                  <MenuItem onClick={() => this.handleSwitch("fantasy")}>fantasy</MenuItem>
                  <MenuItem onClick={() => this.handleSwitch("monospace")}>monospace</MenuItem>
                  <MenuItem onClick={() => this.handleSwitch("times")}>times</MenuItem>
                  <MenuItem onClick={() => this.handleSwitch("courier")}>courier</MenuItem>
                  <MenuItem onClick={() => this.handleSwitch("arial")}>arial</MenuItem>
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