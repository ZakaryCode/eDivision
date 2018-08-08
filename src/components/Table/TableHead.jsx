/**
 * @author: Zakary.Zhu
 * @description:   表格样式
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends Component {
  static propTypes = {
    // classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    columnData: PropTypes.array.isRequired,
    hasCheckBox: PropTypes.bool.isRequired
  };
  createSortHandler = (property) => (event) => {
    this
      .props
      .onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      columnData,
      hasCheckBox
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {hasCheckBox
            ? <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={numSelected === rowCount}
                  onChange={onSelectAllClick}/>
              </TableCell>
            : null}
          {columnData.map((column) => (
            <TableCell
              key={column.id}
              numeric={column.numeric}
              padding={column.disablePadding
              ? 'none'
              : 'default'}
              sortDirection={orderBy === column.id
              ? order
              : false}>
              <Tooltip
                title="Sort"
                placement={column.numeric
                ? 'bottom-end'
                : 'bottom-start'}
                enterDelay={300}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}>
                  {column.label}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    );
  }
}

const styles = (theme) => ({
  head: {
    // backgroundColor: theme.palette.primary.dark, color:
    // theme.palette.primary.contrastText,
    fontSize: 16
  }
});

export default withStyles(styles)(EnhancedTableHead);