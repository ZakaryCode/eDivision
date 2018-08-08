/**
 * @author zakary
 * @description 步进
 */

import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Button, MobileStepper, Slider} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import {observer} from 'mobx-react';
import {observable, computed} from "mobx";
import './Stepper.css';

@observer class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    steps: PropTypes.number.isRequired,
    start: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    onSwitch: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      activeStep: this.props.steps
    };
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }), () => {
      this
        .props
        .onSwitch(1)();
    });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }), () => {
      this
        .props
        .onSwitch(0)();
    });
  };

  handleSwitch = (event, value) => {
    this.setState(state => ({activeStep: value}), () => {
      this
        .props
        .onSwitch(2)(value);
    });
  }

  setButton = (dis, label, i = 0) => {
    return <Button
      size="small"
      onClick={i === 1
      ? this.handleNext
      : this.handleBack}
      disabled={this.state.activeStep === dis}>
      {i === 1
        ? label
        : <KeyboardArrowLeft/>}
      {i === 1
        ? <KeyboardArrowRight/>
        : label}
    </Button>
  };

  render() {
    const {classes, start, count} = this.props;
    console.log(start, count, this.state.activeStep);

    return (
      <div className={classes.root}>
        {this.setButton(start || 0, "上一章", 0)}
        <Slider
          value={this.state.activeStep}
          max={count - 1 || 0}
          min={start || 0}
          step={1}
          onChange={this.handleSwitch}/> {this.setButton(count - 1 || 0, "下一章", 1)}
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
    backgroundColor: "rgba(255, 255, 255, 0)"
  }
});

export default withStyles(styles, {withTheme: true})(Content);