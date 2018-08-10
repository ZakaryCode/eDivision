import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  image: {
    position: 'relative',
    // height: 200,
    [
      theme
        .breakpoints
        .down('xs')
    ]: {
      // width: '100% !important', // Overrides inline-style height: 100
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15
      },
      '& $imageTitle': {
        // border: '4px solid currentColor',
        opacity: 1
      }
    }
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  imageSrc: {
    width: 72,
    height: 72,
    // position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%'
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    borderRadius: "50%",
    transition: theme
      .transitions
      .create('opacity')
  },
  imageTitle: {
    position: 'relative',
    opacity: 0
    // padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px
    // ${theme.spacing.unit + 6}px`
  }
});

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    isClicked: PropTypes.bool.isRequired
  };

  render() {
    const {
      classes,
      title,
      url,
      backgroundColor,
      color,
      isClicked,
      onClick
    } = this.props;

    return (
      <ButtonBase
        focusRipple
        key={title}
        className={classes.image}
        focusVisibleClassName={classes.focusVisible}
        style={{
        borderRadius: "50%",
        width: 72,
        height: 72,
        margin: 10
      }}onClick={onClick}>
        <Avatar
          alt={title}
          src={url}
          style={{
          backgroundColor: backgroundColor
        }}
          className={classes.imageSrc}/>
        <span
          className={classes.imageBackdrop}
          style={isClicked
          ? {
            opacity: 0
          }
          : null}/>
        <span className={classes.imageButton}>
          <Typography
            component="span"
            variant="subheading"
            color="inherit"
            className={classes.imageTitle}
            style={{
            color: color
          }}>
            {title}
          </Typography>
        </span>
      </ButtonBase>
    );
  }
}

export default withStyles(styles)(Content);

// * 添加护眼模式、夜间模式、淡蓝、淡绿、淡粉、淡紫、牛皮纸、白瓷砖、大理石、纸张模式
export const images = [
  {
    url: 'https://raw.githubusercontent.com/mui-org/material-ui/master/static/images/grid-' +
        'list/breakfast.jpg',
    title: '纸张',
    color: ''
  }, {
    url: 'https://raw.githubusercontent.com/mui-org/material-ui/master/static/images/grid-' +
        'list/burgers.jpg',
    title: '大理石',
    color: ''
  }, {
    url: 'https://raw.githubusercontent.com/mui-org/material-ui/master/static/images/grid-' +
        'list/camera.jpg',
    title: '白瓷砖',
    color: ''
  }, {
    url: 'https://raw.githubusercontent.com/mui-org/material-ui/master/static/images/grid-' +
        'list/camera.jpg',
    title: '牛皮纸',
    color: ''
  }, {
    title: '护眼',
    backgroundColor: '#66CC99',
    color: '#2E8A5C'
  }, {
    title: '夜间',
    backgroundColor: '#242424',
    color: '#000000'
  }, {
    title: '淡蓝',
    backgroundColor: '#80CCFF',
    color: '#0065A8'
  }, {
    title: '淡绿',
    backgroundColor: '#66CC99',
    color: '#2E8A5C'
  }, {
    title: '淡粉',
    backgroundColor: '#FFCCE6',
    color: '#FF42A4'
  }, {
    title: '淡紫',
    backgroundColor: '#FECCFF',
    color: '#8F91FF'
  }
];