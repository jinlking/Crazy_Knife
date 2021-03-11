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
        this.fileDir = "config/Sign";
    },

    initData(data) {
        if (!data) {
            return;
        }
        this.dataObj = data;
        this.len = this.dataObj.length;
        cc.log(this.dataObj)
    },

    getAllSign() {
        return this.dataObj;
    },
    getSignById(id) {
        let filter = this.dataObj.filter((e) => {
            return e.id == id
        })
        return filter.length ? filter[0] : null
    }
});
