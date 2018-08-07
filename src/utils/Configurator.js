/**
 * @author zakary
 * @description 配置器状态
 */
import {observable, action} from 'mobx';

class Configurator {
    @observable name = '';
    @observable open = false;
    @observable index = 0;
    @observable message = "";
    @observable messageTimer = {};

    constructor(name, open, index) {
        this.name = name;
        this.isOpen(open);
        this.selectIndex(index);
        // this.setMessage("");
    }

    @action isOpen(open) {
        // console.log(open, this.open);
        this.open = !!open;
    }

    @action selectIndex(index) {
        this.index = Number(index) || 0;
    }

    @action setMessage(message, callback) {
        clearTimeout(this.messageTimer);

        this.messageTimer = setTimeout(() => {
            this.message = message || "";
        }, (message
            ? 0
            : 100));

        this.open = (message
            ? true
            : false);
        if (typeof callback === 'function') {
            this.callback = callback;
        }
    }
}

export default Configurator;
