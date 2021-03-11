let WxCloundAPI = require("../framework/platform/WxCloundAPI");
cc.Class({
    extends: cc.Component,

    properties: {
        _isInserset: true
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._SuccessCallBack = null;
        this._FailCallBack = null;

    },

    start() { },
    initSmallBall(params) {
        this.numLabel.string = params.num;
        this.arrow.active = !!params.showArrow;
    },

    /**
    * 当碰撞产生的时候调用
    * @param  {Collider} other 产生碰撞的另一个碰撞组件
    * @param  {Collider} self  产生碰撞的自身的碰撞组件
    */
    onCollisionEnter: function (other, self) {
        if (other.node.group == "fire") {
            if (!this._isInserset) {
                this._isInserset = true
                this.node.stopAllActions();
                zy.event.emit(zy.eventData.EventConst.GameOver);
                cc.log('小球碰撞，游戏失败', this.node);
                zy.audio.playEffect(zy.audio.Effect.CollisionEff)
                var seq = cc.sequence(
                    cc.repeat(cc.spawn(cc.rotateBy(0.1, 90), cc.moveBy(0.1, this.node.x, -100)), 10),
                    cc.removeSelf()
                )
                this.node.runAction(seq);
                zy.director.createPop("prefab/game/LevelEnd")
            }
        } else if (other.node.group == "box") {
            cc.log(other.node)
            other.node.destroy()
            let gold = zy.dataMng.userData.getGold()
            let boxCoin = zy.dataMng.commonData.getCommonData().boxCoin
            let randomInc = zy.utils.randomInteger(boxCoin[0], boxCoin[1])
            cc.log('随机增加金币', randomInc)
            zy.dataMng.userData.setGold(gold + randomInc)
            zy.event.emit(zy.eventData.EventConst.CoinIn, this.node)
            zy.ui.tip.show(`获得金币x${randomInc}`);
            WxCloundAPI.updateUserInfo({ gold: gold + randomInc }, false).then((res) => {
                cc.log("获得金币")
            }, (err) => {
                cc.log(err)
            })
        }
    },
});
