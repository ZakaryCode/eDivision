/**
 * @author zakary
 * @description 标题数据记录
 */

import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import InboxIcon from 'material-ui-icons/MoveToInbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import StarIcon from 'material-ui-icons/Star';
// import SendIcon from 'material-ui-icons/Send';
import MailIcon from 'material-ui-icons/Mail';
// import DeleteIcon from 'material-ui-icons/Delete';
// import ReportIcon from 'material-ui-icons/Report';

const modulePick = (href, name) => {
  // location.hash = href;
};

export const mailFolderListItems = (
  <div>
    <ListItem button onClick={() => modulePick("Home")}>
      <ListItemIcon>
        <InboxIcon/>
      </ListItemIcon>
      <ListItemText primary="主页"/>
    </ListItem>
    <ListItem button onClick={() => modulePick("Order")}>
      <ListItemIcon>
        <StarIcon/>
      </ListItemIcon>
      <ListItemText primary="订单"/>
    </ListItem>
    <ListItem button onClick={() => modulePick("/Portal")}>
      <ListItemIcon>
        <DraftsIcon/>
      </ListItemIcon>
      <ListItemText primary="门户"/>
    </ListItem>
    <ListItem button onClick={() => modulePick("/Vehicle")}>
      <ListItemIcon>
        <DraftsIcon/>
      </ListItemIcon>
      <ListItemText primary="车辆"/>
    </ListItem>
    <ListItem button onClick={() => modulePick("/User")}>
      <ListItemIcon>
        <DraftsIcon/>
      </ListItemIcon>
      <ListItemText primary="人员"/>
    </ListItem>
  </div>
);

export const otherMailFolderListItems = (
  <div>
    <ListItem button onClick={() => modulePick("/MineCenter")}>
      <ListItemIcon>
        <MailIcon/>
      </ListItemIcon>
      <ListItemText primary="个人中心"/>
    </ListItem>
  </div>
);