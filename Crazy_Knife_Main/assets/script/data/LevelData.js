/**
 * Created by xujiawei on 2020-04-30 17:14:55
 */

let DataBase = require("./DataBase");

cc.Class({
    extends: DataBase,

    ctor() {
        this.fileDir = "config/Level";
    },

    initData(data) {
        if (!data) {
            return;
        }
        this.dataObj = data;
        this.len = this.dataObj.length;
        cc.log(this.dataObj)
    },

    getLevelData(level) {
        return this.dataObj[Math.floor(Math.random() * this.dataObj.length)];
    },

    getMaxLevel() {
        return this.len;
    }
});