// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let UtilsOther = require('UtilsOther');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        goldCount: {
            default: null,
            type: cc.Label,
            tooltip: "金币数量"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        zy.event.on(zy.eventData.EventConst.UpdateGold, () => {
            this.updateData()
        }, this);
        this.updateData()
    },
    updateData() {
        this.goldCount.string = UtilsOther.numberToUnity(zy.dataMng.userData.getGold())
        cc.log("更新金币", zy.dataMng.userData.getGold())
    }
    // update (dt) {},
});
