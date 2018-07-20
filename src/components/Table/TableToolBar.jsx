/**
 * @author: Zakary.Zhu
 * @description:   表格样式
 */
import React, {Component} from 'react';
import {Toolbar, Typography, IconButton, Tooltip, withStyles} from 'material-ui';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DeleteIcon from 'material-ui-icons/Delete';
// import FilterListIcon from 'material-ui-icons/FilterList';
import AddIcon from 'material-ui-icons/Add';
import {lighten} from 'material-ui/styles/colorManipulator';

let EnhancedTableToolbar = (props) => {
  const {numSelected, title, classes, handleDelete, handleCreate} = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
      [classes.highlight]: numSelected > 0
    })}>
      <div className={classes.title}>
        {numSelected > 0
          ? (
            <Typography color="inherit" variant="subheading">
              {numSelected}
              &nbsp;is selected.
            </Typography>
          )
          : (
            <Typography variant="title">{title}</Typography>
          )}
      </div>
      <div className={classes.spacer}/> {numSelected > 0
        ? (typeof handleCreate === 'function'
          ?
            <div className={classes.actions}>
              <Tooltip title="Delete">
                <IconButton aria-label="Delete" onClick={handleDelete}>
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
            </div>
          : <div className={classes.actions}/>)
        : (typeof handleCreate === 'function'
          ?
            <div className={classes.actions}>
              <Tooltip title="Add">
                <IconButton aria-label="Add" onClick={handleCreate}>
                  <AddIcon/>
                </IconButton>
              </Tooltip>
            </div>
          : <div className={classes.actions}/>)}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

const styles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight: theme.palette.type === 'light'
    ? {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85)
    }
    : {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary.dark
    },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary,
    display: 'contents'
  },
  title: {
    flex: '0 0 auto'
  }
});

export default withStyles(styles)(EnhancedTableToolbar);