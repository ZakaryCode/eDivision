/**
 * @author: Zakary.Zhu
 * @description:   表格样式
 */
import React, {Component} from 'react';
import {IconButton, withStyles} from 'material-ui';
import {TablePagination} from 'material-ui/Table';
import FirstPageIcon from 'material-ui-icons/FirstPage';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import LastPageIcon from 'material-ui-icons/LastPage';

import PropTypes from 'prop-types';

class TablePaginationActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired
  };

  handleFirstPageButtonClick = (event) => {
    this
      .props
      .onChangePage(event, 1);
  };

  handleBackButtonClick = (event) => {
    this
      .props
      .onChangePage(event, this.props.page);
  };

  handleNextButtonClick = (event) => {
    this
      .props
      .onChangePage(event, this.props.page + 2);
  };

  handleLastPageButtonClick = (event) => {
    this
      .props
      .onChangePage(event, Math.max(1, Math.ceil(this.props.count / this.props.rowsPerPage)),);
  };

  render() {
    const {
      classes,
      count,
      page,
      rowsPerPage,
      theme
    } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page">
          {theme.direction === 'rtl'
            ? <LastPageIcon/>
            : <FirstPageIcon/>}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page">
          {theme.direction === 'rtl'
            ? <KeyboardArrowRight/>
            : <KeyboardArrowLeft/>}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page">
          {theme.direction === 'rtl'
            ? <KeyboardArrowLeft/>
            : <KeyboardArrowRight/>}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page">
          {theme.direction === 'rtl'
            ? <FirstPageIcon/>
            : <LastPageIcon/>}
        </IconButton>
      </div>
    );
  }
}

const TablePaginationActionsWrapped = withStyles((theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
}), {withTheme: true})(TablePaginationActions,);

class EnhancedTableHead extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired
  };
  createSortHandler = (property) => (event) => {
    this
      .props
      .onRequestSort(event, property);
  };

  render() {
    const {
      count,
      rowsPerPage,
      page,
      onChangePage,
      onChangeRowsPerPage
    } = this.props;
    // console.log(page+'-'+rowsPerPage+'-'+count);

    return (<TablePagination
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[
      5,
      10,
      15,
      20,
      25,
      50,
      100
    ]}
      page={page - 1}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      backIconButtonProps={{
      'aria-label': 'Previous Page'
    }}
      nextIconButtonProps={{
      'aria-label': 'Next Page'
    }}
      labelRowsPerPage="每页行数"
      labelDisplayedRows={(e) => (e.from + '-' + e.to + ' of ' + e.count)}
      Actions={TablePaginationActionsWrapped}/>);
  }
}

const styles = (theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

export default withStyles(styles)(EnhancedTableHead);
