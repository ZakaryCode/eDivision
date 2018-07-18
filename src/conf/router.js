const __url = [
        '123.206.187.109', '127.0.0.1'
    ],
    prefix = {
        URI: '//127.0.0.1:3001/v1/',
        mock: '//123.206.187.109/logisticsManage/mock/',
        phpBack: '//123.206.187.109/logisticsManage/',
        locnode: '//' + __url[1] + ':3001/v1/'
    };

const route = {
        user: {
            login: {
                URI: 'user/login',
                mock: 'Administrator/login.JSON'
            },
            register: {
                URI: 'user/register',
                mock: 'Administrator/register.JSON'
            },
            verifications: 'verifications/picture',
            getList: "user"
        },
        order: {
            getList: "order",
            add: "order/add",
            delate: "order/delate",
            search: "order/search",
            getDetail: "order"
        },
        logistics: {
            search: "logistics/search"
        },
        portal: {
            getList: "portal"
        },
        vehicle: {
            getList: "vehicle"
        },
        area: {
            getList: "area"
        }
    },
    router = (type) => ({
        map: 'http://api.map.baidu.com/api?v=2.0&ak=lBsexKt4vW8gXMR6SNWOKnEIVhQLcMDl',
        user: {
            login: getURI(route.user.login, type),
            register: getURI(route.user.register, type),
            verifications: getURI(route.user.verifications, type),
            getList: getURI(route.user.getList, type)
        },
        order: {
            getList: getURI(route.order.getList, type),
            add: getURI(route.order.add, type),
            delate: getURI(route.order.delate, type),
            search: getURI(route.order.search, type),
            getDetail: getURI(route.order.getDetail, type)
        },
        logistics: {
            search: getURI(route.logistics.search, type)
        },
        portal: {
            getList: getURI(route.portal.getList, type)
        },
        vehicle: {
            getList: getURI(route.vehicle.getList, type)
        },
        area: {
            getList: getURI(route.area.getList, type)
        }
    }),
    getURI = (route, type) => {
        let __prefix = (typeof route === "string"
                ? prefix["_"]
                : prefix[type]) || prefix.URI || "",
            __route = (typeof route === "string"
                ? route
                : route[type]) || route.URI || "";
        // console.log(__prefix + __route);
        return __prefix + __route;
    };

export default router;
