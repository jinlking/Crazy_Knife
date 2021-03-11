const EventConst = {
    UpdateGold: "EventConst/UpdateGold", //更新金币
    CoinIn: "EventConst/CoinIn", //金币飞入
    Restart: "EventConst/Restart", //重新开始游戏
    GameOver: "EventConst/GameOver", //游戏结束
    UpdateScore: "EventConst/UpdateScore", //更新分数
    SelectProp: "EventConst/SelectProp", //选择道具
};
// 全局事件管理器
zy.event = new cc.EventTarget();
cc.Class({
    statics: {
        EventConst: EventConst,

        init: function (data) {
        },

        clean: function () {
        }
    }
});