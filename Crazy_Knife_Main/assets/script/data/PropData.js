// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let DataBase = require("./DataBase");
cc.Class({
    extends: DataBase,

    ctor() {
        this.fileDir = "config/Prop";
    },

    initData(data) {
        if (!data) {
            return;
        }
        this.dataObj = data;
        this.len = this.dataObj.length;
        // this.dataObj = Utils.arrayToDict(this.dataObj, "level");
        cc.log(this.dataObj)
    },

    getAllProp() {
        return this.dataObj;
    },
    getPropById(id) {
        let filter = this.dataObj.filter((e) => {
            return e.id == id
        })
        return filter.length ? filter[0] : null
    },
});
