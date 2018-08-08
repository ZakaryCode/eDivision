/**
 * @author: Zakary.Zhu
 * @description:   表格样式
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import CallMergeIcon from '@material-ui/icons/CallMerge';
import {lighten} from '@material-ui/core/styles/colorManipulator';

let EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    title,
    classes,
    handleDelete,
    handleConnect,
    handleCreate
  } = props;

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
          ? <div className={classes.actions}>
              <Tooltip title="合并">
                <IconButton aria-label="connect" onClick={handleConnect}>
                  <CallMergeIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="删除">
                <IconButton aria-label="Delete" onClick={handleDelete}>
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
            </div>
          : <div className={classes.actions}/>)
        : (typeof handleCreate === 'function'
          ? <div className={classes.actions}>
              <Tooltip title="添加">
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
    display: 'flex'
    // display: 'contents'
  },
  title: {
    flex: '0 0 auto'
  }
});

export default withStyles(styles)(EnhancedTableToolbar);