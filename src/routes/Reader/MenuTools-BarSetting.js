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

import Drawer from "../../components/Drawer";
import bottomDrawerTools from '../../store/bottomDrawerTools';
import AvatarButton, {images} from "./Avatar";
import SliderButton from "./Menu-Slider";
import ColorPicker from "./Menu-PickerColor";
import MenuButton from "./Menu-List";

class Content extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    pageStyles: PropTypes.object.isRequired,
    handlePageStyle: PropTypes.func.isRequired,
    handleMenuBarControl: PropTypes.func.isRequired,
    handleDrawerOpen: PropTypes.func.isRequired,
    bottomOpenSetting: PropTypes.bool.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      bottomOpenSetting: bottomDrawerTools.open
    };
  }

  render() {
    const {classes, pageStyles} = this.props;
    const {handleDrawerOpen, handlePageStyle, bottomOpenSetting} = this.props;
    // console.log(bottomOpenSetting);

    return (
      <Drawer
        anchor="bottom"
        open={bottomOpenSetting}
        className={classes.toolsBarPaper}
        handleDrawerOpen={handleDrawerOpen("bottomOpenSetting")}>
        <div>
          <List>
            <ListItem className={classes.toolsBarListItem}>
              {images.map(e => (<AvatarButton
                title={e.title}
                url={e.url}
                backgroundColor={e.backgroundColor}
                color={e.color}
                isClicked={true}
                onClick={() => {
                handlePageStyle("backgroundColor")(e.backgroundColor);
                handlePageStyle("backgroundImage")(`url(${e.url})`);
                handlePageStyle("color")(e.color);
              }}/>))}
            </ListItem>
            <Divider/>
            <ListItem
              className={classes.toolsBarListItem}
              style={{
              display: "flex"
            }}>
              <MenuButton
                name={`视宽 ${pageStyles.screenWidth}`}
                listName="WIDTH"
                value={pageStyles.screenWidth}
                handleSwitch={(value) => {
                handlePageStyle("screenWidth")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}/>
              <MenuButton
                name={`字体 ${pageStyles.fontFamily}`}
                listName="font"
                value={pageStyles.fontFamily}
                handleSwitch={(value) => {
                handlePageStyle("fontFamily")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}/>
              <SliderButton
                name={`字号 ${pageStyles.fontSize}`}
                min={12}
                max={128}
                value={pageStyles.fontSize}
                handleSwitch={(event, value) => {
                handlePageStyle("fontSize")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}/>
              <SliderButton
                name={`行间距 ${pageStyles.verticalSpacing}`}
                min={1}
                max={128}
                value={pageStyles.verticalSpacing}
                handleSwitch={(event, value) => {
                handlePageStyle("verticalSpacing")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}/>
              <ColorPicker
                name={`字色 ${pageStyles.color}`}
                value={pageStyles.color}
                handleSwitch={(value) => {
                handlePageStyle("color")(value);
              }}
                handleMenuBarControl={this.props.handleMenuBarControl}/>
              <ColorPicker
                name={`背景色 ${pageStyles.backgroundColor}`}
                value={pageStyles.backgroundColor}
                hasAlpha={true}
                handleSwitch={(value) => {
                handlePageStyle("backgroundColor")(value);
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
    }
  });
}

export default withStyles(styles)(Content);