// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        closeBtn: {
            default: null,
            type: cc.Node,
            tooltip: "关闭按钮"
        },
        signReward1: {
            default: null,
            type: cc.Node,
            tooltip: "签到组1"
        },
        signReward2: {
            default: null,
            type: cc.Node,
            tooltip: "签到组2"
        },
        signReward1Prefab: {
            default: null,
            type: cc.Prefab,
        },
        signReward2Prefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseHandler, this);
        let signData = zy.dataMng.signData.getAllSign()
        signData.forEach((element, index) => {
            let sign = cc.instantiate(this.signReward1Prefab);
            if (index == signData.length - 1) {
                sign = cc.instantiate(this.signReward2Prefab);
                this.signReward2.addChild(sign)
            } else {
                this.signReward1.addChild(sign)
            }
            let signItem = sign.getComponent("SignItem")
            signItem.setData(element)
            // ball.parent = this.bulletBox;
        });
    },

    // update (dt) {},
    onCloseHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.closePop("prefab/sign/Sign")
    }
});
