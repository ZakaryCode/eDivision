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
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import SvgIcon from '@material-ui/core/SvgIcon';

import Drawer from "../../components/Drawer";
import Stepper from "../../components/Stepper";
import bottomDrawerTools from '../../store/bottomDrawerTools';
import SliderButton from "./Menu-Slider";
import MenuButton from "./Menu-List";

const ResumeIcon = (props) => {
    return (
      <SvgIcon {...props} viewBox="-60 -60 340 340">
        <rect
          stroke="#000"
          id="resume_1"
          height="200"
          width="35"
          y="10"
          x="20"
          fill-opacity="null"
          stroke-opacity="null"
          stroke-width="1.5"
          fill="#000000"/>
        <path
          stroke="#000"
          transform="rotate(-135 99.5,109.5)"
          id="resume_2"
          d="m16,193l27,-167l140,139l-166,28l-1,0z"
          stroke-opacity="null"
          stroke-width="2"
          fill="#000000"/>
      </SvgIcon>
    );
  },
  ICON = {
    PlayArrow: PlayArrowIcon,
    Pause: PauseIcon,
    Resume: ResumeIcon,
    Stop: StopIcon,
    KeyboardReturn: KeyboardReturnIcon,
    SkipPrevious: SkipPreviousIcon,
    SkipNext: SkipNextIcon,
    VolumeUp: VolumeUpIcon,
    VolumeDown: VolumeDownIcon,
    VolumeMute: VolumeMuteIcon,
    VolumeOff: VolumeOffIcon
  },
  IconB = (props) => {
    const {title, size, onClick, iconName} = props;
    const IconL = ICON[iconName];
    return <div style={{}}>
      <Tooltip title={title}>
        <IconButton size={size} onClick={onClick}>
          <IconL {...props}/>
        </IconButton>
      </Tooltip>
    </div>
  }

  class Content extends Component {
    static propTypes = {
      classes: PropTypes.object.isRequired,
      fileL: PropTypes.number.isRequired,
      fileIndex: PropTypes.number.isRequired,
      handleSwitchPage: PropTypes.func.isRequired,
      radioIndex: PropTypes.number.isRequired,
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
      const {classes, fileL, fileIndex, radioIndex, radioControl} = this.props;
      const {handleDrawerOpen, handleSwitchPage, handleRadioControl, bottomOpenRadio} = this.props;
      // console.log("getVolumeIcon", classes);
      const getVolumeIcon = (volume) => {
        if (radioControl.hasVolume) {
          if (volume <= 0) {
            return <ICON.VolumeMute/>
          } else if (volume <= 50) {
            return <ICON.VolumeDown/>
          } else {
            return <ICON.VolumeUp/>
          }
        } else {
          return <ICON.VolumeOff/>
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
              <ListItem className={classes.toolsBarListItem}>
                <Stepper start={0} count={fileL} steps={fileIndex} onSwitch={handleSwitchPage}/>
              </ListItem>
              <Divider/>
              <ListItem
                className={classes.toolsBarListItem}
                style={{
                margin: "auto"
              }}>
                <div style={{
                  display: "inline-flex"
                }}>
                  <IconB
                    title="退出"
                    onClick={() => {
                    handleDrawerOpen("bottomOpenRadio")(false);
                  }}
                    iconName="KeyboardReturn"
                    style={{
                    color: "#000"
                  }}/>
                  <IconB
                    title="快退"
                    onClick={() => {}}
                    iconName="SkipPrevious"
                    style={{
                    color: "#000"
                  }}/> {radioControl.isPlaying
                    ? <IconB
                        title="暂停"
                        onClick={() => {}}
                        iconName="Pause"
                        style={{
                        fontSize: '-webkit-xxx-large',
                        color: "#000"
                      }}/>
                    : (!radioIndex
                      ? <IconB
                          title="播放"
                          onClick={() => {}}
                          iconName="PlayArrow"
                          style={{
                          fontSize: '-webkit-xxx-large',
                          color: "#000"
                        }}/>
                      : <IconB
                        title="恢复"
                        onClick={() => {}}
                        iconName="Resume"
                        style={{
                        fontSize: '-webkit-xxx-large',
                        color: "#000"
                      }}/>)}
                  <IconB
                    title="停止"
                    onClick={() => {}}
                    iconName="Stop"
                    style={{
                    color: "#000"
                  }}/>
                  <IconB
                    title="快进"
                    onClick={() => {}}
                    iconName="SkipNext"
                    style={{
                    color: "#000"
                  }}/>
                </div>
              </ListItem>
              <Divider/>
              <ListItem
                className={classes.toolsBarListItem}
                style={{
                display: "flex"
              }}>
                <MenuButton
                  name={`音频采样率 ${radioControl.AUF}`}
                  listName="AUF"
                  value={radioControl.AUF}
                  handleSwitch={(value) => {
                  handleRadioControl("AUF")(value);
                }}
                  handleMenuBarControl={this.props.handleMenuBarControl}/>
                <MenuButton
                  name={`音频编码 ${radioControl.AUE}`}
                  listName="AUE"
                  value={radioControl.AUE}
                  handleSwitch={(value) => {
                  handleRadioControl("AUE")(value);
                }}
                  handleMenuBarControl={this.props.handleMenuBarControl}/>
                <MenuButton
                  name={`发音人 ${radioControl.VOICE_NAME}`}
                  listName="VOICE_NAME"
                  value={radioControl.VOICE_NAME}
                  handleSwitch={(value) => {
                  handleRadioControl("VOICE_NAME")(value);
                }}
                  handleMenuBarControl={this.props.handleMenuBarControl}/>
                <MenuButton
                  name={`引擎类型 ${radioControl.ENGINE_TYPE}`}
                  listName="ENGINE_TYPE"
                  value={radioControl.ENGINE_TYPE}
                  handleSwitch={(value) => {
                  handleRadioControl("ENGINE_TYPE")(value);
                }}
                  handleMenuBarControl={this.props.handleMenuBarControl}/>
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