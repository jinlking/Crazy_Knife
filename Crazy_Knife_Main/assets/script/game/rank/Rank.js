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
        rankingScrollView: {
            default: null,
            type: cc.Node,
            tooltip: "排行榜主域视窗容器"
        },
        closeBtn: {
            default: null,
            type: cc.Node,
            tooltip: "关闭排行榜"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 获取授权
        // this.initUserInfoButton();
    },

    start() {
        // this.show.on(cc.Node.EventType.TOUCH_END, this.friendButtonFunc, this);
        // this.submit.on(cc.Node.EventType.TOUCH_END, this.submitScoreButtonFunc, this);
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseHandler, this);
        this.friendButtonFunc()
    },

    friendButtonFunc() {
        cc.log("发消息给子域")
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: `${envConfig[env].score}x1`
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
    },

    groupFriendButtonFunc: function (event) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            window.wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: `${envConfig[env].score}x1`,
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            cc.log("获取群排行榜数据。x1");
        }
    },

    gameOverButtonFunc: function (event) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            cc.log("获取横向展示排行榜数据。x1");
        }
    },
    // update (dt) {},
    onCloseHandler(){
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.closePop("prefab/rank/Rank")
    }
});

