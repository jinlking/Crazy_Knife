/**
 * Created by xujiawei on 2020-04-30 17:14:55
 */

let DataBase = require("./DataBase");

cc.Class({
    extends: DataBase,

    ctor() {
        this.fileDir = "config/Common";
    },

    initData(data) {
        if (!data) {
            return;
        }
        this.dataObj = data;
        this.len = this.dataObj.length;
        cc.log(this.dataObj)
    },

    getCommonData() {
        return this.len && this.dataObj[0] ;
    }
});