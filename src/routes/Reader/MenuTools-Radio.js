/**
 * @author zakary
 * @description 内容页
 * 开发纪要：
 * 添加字体、字号、字色、背景选择功能
 * 添加护眼模式、夜间模式、淡蓝、淡绿、淡粉、淡紫、牛皮纸、白瓷砖、大理石、纸张模式
 * 添加宽视距、中等视距、窄视距模式
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import SvgIcon from '@material-ui/core/SvgIcon';

import Drawer from "../../components/Drawer";
import bottomDrawerTools from '../../store/bottomDrawerTools';
import SliderButton from "./Menu-Slider";

const ResumeIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </SvgIcon>
  );
}

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    radioControl: PropTypes.object.isRequired,
    handleRadioControl: PropTypes.func.isRequired,
    handleMenuBarControl: PropTypes.func.isRequired,
    handleDrawerOpen: PropTypes.func.isRequired,
    bottomOpenRadio: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      bottomOpenRadio: bottomDrawerTools.open
    };
  }

  render() {
    const {classes, radioControl} = this.props;
    const {handleDrawerOpen, handleRadioControl, bottomOpenRadio} = this.props;
    // console.log("getVolumeIcon",classes);
    const getVolumeIcon = (volume) => {
      if (radioControl.hasVolume) {
        if (volume <= 0) {
          return <VolumeMuteIcon/>
        } else if (volume <= 50) {
          return <VolumeDownIcon/>
        } else {
          return <VolumeUpIcon/>
        }
      } else {
        return <VolumeOffIcon/>
      }
    }

    return (
      <Drawer
        anchor="bottom"
        open={bottomOpenRadio}
        className={classes.toolsBarPaper}
        handleDrawerOpen={handleDrawerOpen("bottomOpenRadio")}>
        <div>
          <List>
            <ListItem
              className={classes.toolsBarListItem}
              style={{
              display: "flex"
            }}>
              <Tooltip title="播放">
                <IconButton size="large" onClick={() => {}}>
                  <PlayArrowIcon
                    style={{
                    fontSize: '-webkit-xxx-large'
                  }}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="暂停">
                <IconButton size="medium" onClick={() => {}}>
                  <PauseIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="恢复">
                <IconButton onClick={() => {}}>
                  <ResumeIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="停止">
                <IconButton onClick={() => {}}>
                  <StopIcon/>
                </IconButton>
              </Tooltip>
            </ListItem>
            <Divider/>
            <ListItem
              className={classes.toolsBarListItem}
              style={{
              display: "flex"
            }}>
              <SliderButton
                name={`语速 ${radioControl.speed}`}
                min={0}
                max={100}
                value={radioControl.speed}
                handleSwitch={(event, value) => {
                handleRadioControl("speed")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}/>
              <SliderButton
                name={`音量 ${radioControl.volume}`}
                min={0}
                max={100}
                value={radioControl.volume}
                handleSwitch={(event, value) => {
                handleRadioControl("volume")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}>
                <IconButton
                  style={{
                  position: "absolute",
                  bottom: 2,
                  left: `calc((100% - 48px) / 2)`
                }}
                  onClick={() => {
                  handleRadioControl("hasVolume")(!radioControl.hasVolume)
                }}
                  parentItemStyle={{
                  paddingBottom: 52
                }}>
                  {getVolumeIcon(radioControl.volume)}
                </IconButton>
              </SliderButton>
              <SliderButton
                name={`音高 ${radioControl.pitch}`}
                min={0}
                max={100}
                value={radioControl.pitch}
                handleSwitch={(event, value) => {
                handleRadioControl("pitch")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}/>
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}

const styles = (theme) => {
  return ({
    toolsBarPaper: {
      width: "50%",
      margin: "auto",
      borderWidth: 0,
      textAlign: "center"
    },
    toolsBarListItem: {
      textAlign: "center",
      display: "inline-block"
    },
    button: {
      margin: theme.spacing.unit
    }
  });
}

export default withStyles(styles)(Content);