cc.Class({
    extends: cc.Component,

    properties: {
        goHome: {
            default: null,
            type: cc.Node,
            tooltip: "返回主页按钮"
        },
        newRecord: {
            default: null,
            type: cc.Node,
            tooltip: "新纪录"
        },
        getScore: {
            default: null,
            type: cc.Node,
            tooltip: "获得分数"
        },
        reStart: {
            default: null,
            type: cc.Node,
            tooltip: "重新开始按钮"
        },
        goShop: {
            default: null,
            type: cc.Node,
            tooltip: "前往商店按钮"
        },
        score: {
            default: null,
            type: cc.Label,
            tooltip: "获得分数"
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.goHome.on(cc.Node.EventType.TOUCH_END, this.onGoHomeHandler, this);
        this.reStart.on(cc.Node.EventType.TOUCH_END, this.onReStartHandler, this);
        this.goShop.on(cc.Node.EventType.TOUCH_END, this.onGoShopHandler, this);
    },
    init() {
        this.score.string = `${zy.dataMng.userData.getScore()}`
        this.newRecord.active = zy.dataMng.userData.isNewrecord
        this.getScore.active = !this.newRecord.active
        zy.dataMng.userData.isNewrecord = false
    },
    onGoHomeHandler() {
        zy.director.loadScene("mainScene")
    },
    // 重新开始
    onReStartHandler() {
        cc.log("重新开始")
        zy.director.closePop("prefab/game/LevelEnd")
        zy.event.emit(zy.eventData.EventConst.Restart)
    },
    // 打开商店
    onGoShopHandler() {
        cc.log("打开商店")
        zy.director.createPop("prefab/shop/Shop")
    },
    // update (dt) {},
});
