/**
 * @author zakary
 * @description 系统状态
 */
import {observable} from 'mobx';
import logo from '../logo.svg';

class app {
    @observable appTitle = '基于B/S的现代物流管理系统';
    @observable appHomeTitle = '物流管理系统';
    // @observable appModule = 'Home';
    @observable appLogo = logo;

    headerHeight = 65;
    drawerWidth = 240;
}

export default new app();
