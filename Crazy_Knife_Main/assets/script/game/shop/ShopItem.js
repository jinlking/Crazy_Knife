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
        itemBtn: {
            default: null,
            type: cc.Node,
            tooltip: "商品按钮"
        },
        price: {
            default: null,
            type: cc.Label,
            tooltip: "价格"
        },
        icon: {
            default: null,
            type: cc.Sprite,
            tooltip: "图标"
        },
        ownNode: {
            default: null,
            type: cc.Node,
            tooltip: "已拥有"
        },
        saleNode: {
            default: null,
            type: cc.Node,
            tooltip: "出售"
        },
        videoNode: {
            default: null,
            type: cc.Node,
            tooltip: "视频奖励"
        },
        useNode: {
            default: null,
            type: cc.Node,
            tooltip: "正在使用按钮"
        },
        useFlagNode: {
            default: null,
            type: cc.Node,
            tooltip: "正在使用标识"
        },
        lockNode: {
            default: null,
            type: cc.Node,
            tooltip: "未解锁"
        },
        _shopData: null,
        // 属于自己的道具
        _own: false,
        _use: false
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.itemBtn.on(cc.Node.EventType.TOUCH_END, this.onClickItemHandler, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.selectHandler, this);
        zy.event.on(zy.eventData.EventConst.SelectProp, (propId) => {
            this.updateUseOther(propId)
        }, this);
    },

    // update (dt) {},
    init(params) {
        this._shopData = params
        this.price.string = `${params.price}`
        let prop = zy.dataMng.propData.getPropById(params.propId)
        this._own = zy.dataMng.userData.isOwnProp(prop.id)
        cc.log(prop)
        this.updateBtn()
        cc.loader.loadRes(`new/knife/${prop.knifeIcon}`, cc.SpriteFrame, (err, spf) => {
            if (!err) {
                cc.log(spf)
                this.icon.spriteFrame = spf;
            }
        });
    },
    updateBtn() {
        this.ownNode.active = false
        this.saleNode.active = false
        this.videoNode.active = false
        this.lockNode.active = true
        if (this._own) {
            this.lockNode.active = false
            this.updateUse()
        }else if (this._shopData.videoUnlock == 1) {
            this.videoNode.active = true
        } else {
            this.saleNode.active = true
        }
    },
    onClickItemHandler(e) {
        let ownKnife = zy.dataMng.userData.getOwnProp()
        if (this._own) {
            this.selectHandler()
        } else if (this._shopData.videoUnlock == 1) {
            zy.audio.playEffect(zy.audio.Effect.CommonClick)
            zy.ui.tip.show("观看视频中");
            this.scheduleOnce(() => {
                WxCloundAPI.updateUserInfo({ ownKnife: ownKnife.includes(this._shopData.propId) ? ownKnife : [...ownKnife, this._shopData.propId] }).then((res) => {
                    zy.ui.tip.show("已解锁");
                    this._own = true
                    zy.dataMng.userData.addOwnProp(this._shopData.propId)
                    // 刷新
                    this.updateBtn()
                }, (err) => {
                    zy.ui.tip.show("解锁错误");
                })
            }, 2);
        } else {
            zy.audio.playEffect(zy.audio.Effect.CommonClick)
            let gold = zy.dataMng.userData.getGold()
            if (gold < this._shopData.price) {
                zy.ui.tip.show("金币不足");
                return
            }
            let diff = gold - this._shopData.price
            WxCloundAPI.updateUserInfo({gold: diff, ownKnife: ownKnife.includes(this._shopData.propId) ? ownKnife : [...ownKnife, this._shopData.propId] }).then((res) => {
                this._own = true
                zy.dataMng.userData.isOwnProp(this._shopData.propId)
                zy.dataMng.userData.setGold(diff)
                zy.dataMng.userData.addOwnProp(this._shopData.propId)
                // 刷新
                zy.event.emit(zy.eventData.EventConst.UpdateGold);
                this.updateBtn()
                zy.ui.tip.show("已解锁");
            }, (err) => {
                zy.ui.tip.show("解锁错误");
            })
        }
    },
    selectHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        if (!this._own) return
        zy.dataMng.userData.setUseKnife(this._shopData.propId)
        WxCloundAPI.updateUserInfo({ useKnife: this._shopData.propId })
        this.updateUse()
        zy.event.emit(zy.eventData.EventConst.SelectProp, this._shopData.propId)
    },
    updateUse() {
        this._use = zy.dataMng.userData.getUseKnife() == this._shopData.propId
        this.useNode.active = this._use
        this.ownNode.active = !this._use
        this.useFlagNode.active = this._use
    },
    updateUseOther(propId) {
        if (propId != this._shopData.propId) {
            this.updateUse()
        }
    }
});
