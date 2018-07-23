/**
 * @author zakary
 * @description Home
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui';

import Content from './Content';
import './index.css';

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <Content/>
      </div>
    );
  }
}

const styles = (theme) => ({root: {}});

export default withStyles(styles)(Home);