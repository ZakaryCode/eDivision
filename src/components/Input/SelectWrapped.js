import React, {Component} from 'react';
// import {withStyles} from 'material-ui';
import Typography from 'material-ui/Typography';
import {MenuItem} from 'material-ui/Menu';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
import Select from 'react-select';

export default function SelectWrapped(props) {
  const {
      classes,
      ...other
    } = props,
    emptyLabel = (
      <Typography>No results found</Typography>
    ),
    arrowup = (<ArrowDropUpIcon/>),
    arrowdown = (<ArrowDropDownIcon/>);
  return (
    <Select
      optionComponent={Option}
      noResultsText={emptyLabel}
      arrowRenderer={(arrowProps) => arrowProps.isOpen
      ? arrowup
      : arrowdown}
      clearRenderer={() => <ClearIcon/>}
      valueComponent={(valueProps) => {
      const {value, children, onRemove} = valueProps,
        onDelete = (event) => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        },
        deleteIcon = (<CancelIcon onTouchEnd={onDelete}/>);
      if (onRemove) {
        return (<Chip
          tabIndex={-1}
          label={children}
          className={classes.chip}
          deleteIcon={deleteIcon}
          onDelete={onDelete}/>);
      }
      return <div className="Select-value">{children}</div>;
    }}
      {...other}/>
  );
}

class Option extends Component {
  handleClick = (event) => {
    this
      .props
      .onSelect(this.props.option, event);
  };

  render() {
    const {children, isFocused, isSelected, onFocus} = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
        fontWeight: isSelected
          ? 500
          : 400
      }}>
        {children}
      </MenuItem>
    );
  }
}