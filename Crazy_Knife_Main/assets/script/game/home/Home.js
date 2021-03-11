let WxCloundAPI = require("../../framework/platform/WxCloundAPI");
cc.Class({
    extends: cc.Component,
    properties: {
        startBtn: {
            default: null,
            type: cc.Node,
            tooltip: "开始按钮"
        },
        shopBtn: {
            default: null,
            type: cc.Node,
            tooltip: "商店按钮"
        },
        signInBtn: {
            default: null,
            type: cc.Node,
            tooltip: "签到按钮"
        },
        bonusBtn: {
            default: null,
            type: cc.Node,
            tooltip: "视频礼包按钮"
        },
        turnBtn: {
            default: null,
            type: cc.Node,
            tooltip: "转盘按钮"
        },
        rankBtn: {
            default: null,
            type: cc.Node,
            tooltip: "排行榜按钮"
        },
        iconNode: {
            default: null,
            type: cc.Node,
            tooltip: "金币节点"
        }
        ,
        iconPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "金币预制"
        }
    },
    onLoad() {
        if (FirstEnter) {
            this.init()
            FirstEnter = false
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                zy.ui.loading.show('login')
                let exportJson = {};
                let sysInfo = window.wx.getSystemInfoSync();
                //获取微信界面大小
                let width = sysInfo.screenWidth;
                let height = sysInfo.screenHeight;
                window.wx.getSetting({
                    success(res) {
                        cc.log(res.authSetting);
                        if (res.authSetting["scope.userInfo"]) {
                            cc.log("用户已授权");
                            window.wx.getUserInfo({
                                success(res) {
                                    cc.log(res);
                                    exportJson.userInfo = res.userInfo;
                                    //此时可进行登录操作
                                    zy.ui.loading.hide('login')
                                }
                            });
                        } else {
                            zy.ui.loading.hide('login')
                            cc.log("用户未授权");
                            let button = window.wx.createUserInfoButton({
                                type: 'text',
                                text: '',
                                style: {
                                    left: 0,
                                    top: 0,
                                    width: width,
                                    height: height,
                                    backgroundColor: '#00000000',//最后两位为透明度
                                    color: '#ffffff',
                                    fontSize: 20,
                                    textAlign: "center",
                                    lineHeight: height,
                                }
                            });
                            button.onTap((res) => {
                                if (res.userInfo) {
                                    cc.log("用户授权:", res);
                                    exportJson.userInfo = res.userInfo;
                                    //此时可进行登录操作
                                    button.destroy();
                                } else {
                                    cc.log("用户拒绝授权:", res);
                                }
                            });
                        }
                    }
                })
            }
        }
    },
    start() {
        this.startBtn.on(cc.Node.EventType.TOUCH_END, this.onStartBtnHandler, this);
        this.shopBtn.on(cc.Node.EventType.TOUCH_END, this.onShopBtnHandler, this);
        this.bonusBtn.on(cc.Node.EventType.TOUCH_END, this.onBonusBtnHandler, this);
        this.signInBtn.on(cc.Node.EventType.TOUCH_END, this.onSignInBtnHandler, this);
        this.turnBtn.on(cc.Node.EventType.TOUCH_END, this.onTurnBtnHandler, this);
        this.rankBtn.on(cc.Node.EventType.TOUCH_END, this.onRankBtnHandler, this);
        this.iconNode.addChild(cc.instantiate(this.iconPrefab))
    },
    //开始按钮
    onStartBtnHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.loadScene("gameScene");
        cc.log("开始按钮")
    },
    //商店按钮
    onShopBtnHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.createPop("prefab/shop/Shop")
        cc.log("商店按钮")
    },
    //签到按钮
    onSignInBtnHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.createPop("prefab/sign/Sign")
        cc.log("签到按钮")
    },
    //视频礼包按钮
    onBonusBtnHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.loadScene("gameScene");
        cc.log("视频礼包按钮")
    },
    //转盘按钮
    onTurnBtnHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.loadScene("gameScene");
        cc.log("转盘按钮")
    },
    //排行榜按钮
    onRankBtnHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.createPop("prefab/rank/Rank")
        cc.log("排行榜按钮")
    },
    // update (dt) {},
    init() {

        zy.utils = require("./../../framework/common/UtilsOther");


        zy.constData = require("./../../data/ConstData");
        zy.constData.init();

        // 事件信息
        zy.eventData = require("./../../data/EventConst");
        zy.eventData.init();


        // 通用UI工具
        zy.ui = require('./../../framework/common/UI');
        zy.ui.init();


        // 音频管理
        zy.audio = require("./../../framework/common/Audio");
        zy.audio.init();

        zy.director = require("./../../framework/common/Director");
        zy.director.init();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            window.wx.showShareMenu({
                withShareTicket: true
            });
            window.wx.onShareAppMessage(function () {
                return {
                    title: "一起来玩吧",
                    imageUrl: 'https://6465-debug-9g5ku4kd80230fea-1305103240.tcb.qcloud.la/shareImg/share.png?sign=6b1cbd45cf4db8b495a4b8cc60b9c1d2&t=1614912130'
                }
            })
        }
        // 配置表读取
        const DataMng = require("./../../data/DataMng");
        zy.dataMng = new DataMng();
        // zy.ui.loading.show('init')
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            WxCloundAPI.initWXCloud()
            WxCloundAPI.getConfgUrl()
                .then(res => {
                    console.log(window.envConfig)
                    let url  = `${window.envConfig[window.env].configUrl}/game_config_v${res.url}.zip`
                    cc.log("---getConfgUrl", url)
                    return zy.dataMng.initConfigs(url)
                }).then(res => {
                    return WxCloundAPI.getPlayerInfo()
                }).then(res => {
                    zy.dataMng.userData.initData(res.gold, res.useKnife, res.ownKnife, res.score, res.sign, res.signTime)
                    cc.log("---getPlayerInfo", res)
                    zy.event.emit(zy.eventData.EventConst.UpdateGold)
                    // zy.ui.loading.hide('init')
                })
                .catch(err => {
                    cc.log(err)
                })
        } else {
            zy.dataMng.loadDataFromLocalFile((c, t) => {
                cc.log("load local config: %d/%d", c, t);
            }, () => {
                // zy.ui.loading.hide('init')
                // zy.director.loadScene("mainScene"); 
            });
        }
    },
});
