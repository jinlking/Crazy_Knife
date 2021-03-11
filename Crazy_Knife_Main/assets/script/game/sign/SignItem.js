// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let WxCloundAPI = require("../../framework/platform/WxCloundAPI");

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
        count: {
            default: null,
            type: cc.Label,
            tooltip: "奖励数量"
        },
        day: {
            default: null,
            type: cc.Label,
            tooltip: "签到天数"
        },
        icon: {
            default: null,
            type: cc.Sprite,
            tooltip: "奖励图标"
        },
        signed: {
            default: null,
            type: cc.Node,
            tooltip: "已签到"
        },
        _data: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickItemHandler, this)
    },
    onClickItemHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        let signed = zy.dataMng.userData.getSigned()
        let signedTime = zy.dataMng.userData.getSignedTime()
        let gold = zy.dataMng.userData.getGold()
        let ownKnife = zy.dataMng.userData.getOwnProp()
        let nowDate = +new Date
        if (signed == this._data.id - 1 &&  nowDate>= new Date(Number(signedTime)).setHours(24, 0, 0, 0)) {
            let updateSign = {}
            if (this._data.rewardType == 1) {
                updateSign = { ownKnife: ownKnife.includes(this._data.rewardPropId) ? ownKnife : [...ownKnife, this._data.rewardPropId] }
            } else if (this._data.rewardType == 0) {
                updateSign = { gold: this._data.rewardCount + gold }
            }
            WxCloundAPI.updateUserInfo({
                sign: signed + 1,
                signTime: `${+new Date}`,
                ...updateSign
            }).then(() => {
                zy.ui.tip.show("签到成功");
                zy.dataMng.userData.setSigned(signed + 1)
                zy.dataMng.userData.setSignedTime(nowDate)
                this.signFlagHandler()
                if (this._data.rewardType == 1) {
                    zy.dataMng.userData.addOwnProp(this._data.rewardPropId)
                } else if (this._data.rewardType == 0) {
                    zy.dataMng.userData.setGold(gold + this._data.rewardCount)
                    zy.event.emit(zy.eventData.EventConst.UpdateGold)
                }
            })
        }
    },
    setData(data) {
        this._data = data
        if (data.rewardType == 1) {
            this.count.node.active = false
        } else {
            this.count.node.active = true
            this.count.string = `+${data.rewardCount}`
        }
        this.signFlagHandler()
        this.day.string = `第${data.id}天`
        cc.loader.loadRes(`${data.rewardIcon}.png`, cc.SpriteFrame, null, (err, spriteFrame) => {
            if (!err) {
                this.icon.spriteFrame = spriteFrame
            }
        });
    },
    signFlagHandler() {
        this.signed.active = zy.dataMng.userData.getSigned() >= this._data.id
        if (this.signed.active) this.count.node.active = false
    }
    // update (dt) {},
});
