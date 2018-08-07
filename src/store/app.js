/**
 * @author zakary
 * @description 系统状态
 */
import {observable, action} from 'mobx';
import logo from '../logo.svg';

import utils from '../utils/app';
import snack from '../store/snack';
import router from '../conf/router';
const route = router("locnode");

class app {
    @observable appTitle = '基于B/S的现代物流管理系统';
    @observable appHomeTitle = '物流管理系统';
    // @observable appModule = 'Home';
    @observable appLogo = logo;

    headerHeight = 65;
    drawerWidth = 240;

    @observable appModule = {
        "": "Home",
        "#/Home": "Home",
        "Order": "订单列表",
        "Order/Detail": "订单详情",
        "Order/Create": "订单创建",
        "Portal": "门户列表",
        "Portal/Create": "门户创建",
        "Vehicle": "车辆列表",
        "User": "人员列表",
        "MineCenter": "个人中心"
    }

    @observable gender = [
        {
            value: "男",
            label: "男"
        }, {
            value: "女",
            label: "女"
        }
    ]

    @observable userState = [
        {
            value: "系统管理员",
            label: "系统管理员"
        }, {
            value: "站点管理员",
            label: "站点管理员"
        }, {
            value: "车辆管理员",
            label: "车辆管理员"
        }, {
            value: "普通用户",
            label: "普通用户"
        }, {
            value: "游客",
            label: "游客"
        }
    ]

    @observable orderState = [
        {
            value: "创建",
            label: "创建"
        }, {
            value: "已揽件",
            label: "已揽件"
        }, {
            value: "入库",
            label: "入库"
        }, {
            value: "出库",
            label: "出库"
        }, {
            value: "运输中",
            label: "运输中"
        }, {
            value: "确认收货",
            label: "确认收货"
        }, {
            value: "签收",
            label: "签收"
        }
    ]

    @observable infoState = [
        {
            value: "待处理",
            label: "待处理"
        }, {
            value: "处理中",
            label: "处理中"
        }, {
            value: "已完成",
            label: "已完成"
        }
    ]

    @observable portalState = [
        {
            value: "仓库",
            label: "仓库"
        }, {
            value: "中转站",
            label: "中转站"
        }, {
            value: "网点",
            label: "网点"
        }, {
            value: "其他",
            label: "其他"
        }
    ]

    @observable map = route.map;

    @action area(callback, data) {
        fetch(route.area.getList + utils.formatSearch(data), {
            method: 'GET',
            mode: 'cors',
            // credentials: 'include',
            headers: new Headers({'Content-Type': 'application/json', 'Accept': 'application/json'})
        }).then((res) => res.json()).then((res) => {
            console.log(route.area.getList + utils.formatSearch(data), res);
            if (res.isSuccess) {
                let data = res.data;
                if (typeof callback === "function") {
                    callback(data);
                }
            } else {
                snack.setMessage("ERROR " + res.status + " :" + res.message);
                console.log("ERROR " + res.status + " :" + res.message);
            }
        }).catch((error) => {
            snack.setMessage("ERROR " + error);
            console.log("ERROR " + error);
        });
    }
    /* constructor() {
    } */
    appPitchModule() {
        // console.log(this.appModule, location.hash.substring(2).split('?')[0]); return
        // this.appModule[     location         .hash         .substring(2)
        // .split('?')[0]         // .reverse()[0] ];
    }
}

export default new app();
