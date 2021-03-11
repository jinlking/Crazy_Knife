// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let WxCloundAPI = require("../framework/platform/WxCloundAPI");
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
        quiver: {
            default: null,
            type: cc.Node,
            tooltip: "箭袋"
        },
        smallBallPF: {
            default: null,
            type: cc.Prefab,
            tooltip: "弓箭预制体"
        },
        smallBallPFArr: {
            default: [],
            type: [cc.Prefab],
            tooltip: "弓箭预制体数组"
        },
        bigBall: {
            default: null,
            type: cc.Node,
            tooltip: "大球旋转容器"
        },
        bigBallShadow: {
            default: null,
            type: cc.Node,
            tooltip: "大球阴影"
        },
        bigBallBG: {
            default: null,
            type: cc.Node,
            tooltip: "大球背景"
        },
        bigBallBGSF: {
            default: [],
            type: [cc.SpriteFrame],
            tooltip: "大球背景图集"
        },
        quiverInBigBall: {
            default: null,
            type: cc.Node,
            tooltip: "箭插入打球的容器"
        },
        levelLabel: {
            default: null,
            type: cc.Label,
            tooltip: "关卡序号"
        },
        bgNode: cc.Node,
        bigSpeed: {
            default: 2,
            type: cc.Integer,
            tooltip: "大球速度"
        },
        bigOrientation: {
            default: 1,
            type: cc.Integer,
            tooltip: "大球方向：1顺时针 -1逆时针"
        },
        placeholder: {
            default: null,
            type: cc.Node,
            tooltip: "弓箭占位符"
        },
        bulletBox: {
            default: null,
            type: cc.Node,
            tooltip: "子弹容器"
        },
        bullet: {
            default: null,
            type: cc.Prefab,
            tooltip: "子弹预制体"
        },
        iconNode: {
            default: null,
            type: cc.Node,
            tooltip: "金币节点"
        },
        iconPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "金币预制"
        },
        boxPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "宝箱预制"
        },
        score: {
            default: null,
            type: cc.Label,
            tooltip: "分数"
        },
        coinPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "金币动画预制"
        },
        broken: {
            default: null,
            type: cc.Node,
            tooltip: "破碎西瓜节点"
        },
        brokenQuiver: {
            default: null,
            type: cc.Node,
            tooltip: "破碎刀节点"
        },
        brokenPrefab: {
            default: [],
            type: [cc.Prefab],
            tooltip: "破碎西瓜预制"
        },
        brokenBorn: {
            default: null,
            type: cc.Node,
        },
        disk: {
            default: null,
            type: cc.Node,
        },
        _brokenPos: {
            default: [],
            type: [cc.Vec2],
        },
        _coinPool: {
            default: null,
            type: cc.NodePool
        },
        _resIndex: {
            default: [],
            type: [cc.Integer]
        },
        _gameStart: true,
        _curLevel: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._coinPool = new cc.NodePool();
        this.initCoinPool();
    },
    initCoinPool(count = 20) {
        for (let i = 0; i < count; i++) {
            let coin = cc.instantiate(this.coinPrefab);
            this._coinPool.put(coin);
        }
    },
    playAnim(startPoint) {
        let randomCount = Math.random() * 15 + 10;
        let stPos = startPoint.getPosition();
        let edPos = this.iconNode.getPosition();
        this.playCoinFlyAnim(randomCount, stPos, edPos);
    },
    playCoinFlyAnim(count, stPos, edPos, r = 130) {
        // 确保当前节点池有足够的金币
        const poolSize = this._coinPool.size();
        const reCreateCoinCount = poolSize > count ? 0 : count - poolSize;
        this.initCoinPool(reCreateCoinCount);

        // 生成圆，并且对圆上的点进行排序
        let points = this.getCirclePoints(r, stPos, count);
        let coinNodeList = points.map(pos => {
            let coin = this._coinPool.get();
            coin.setPosition(stPos);
            this.node.addChild(coin);
            return {
                node: coin,
                stPos: stPos,
                mdPos: pos,
                edPos: edPos,
                dis: pos.sub(edPos).mag()
            };
        });
        coinNodeList = coinNodeList.sort((a, b) => {
            if (a.dis - b.dis > 0) return 1;
            if (a.dis - b.dis < 0) return -1;
            return 0;
        });
        zy.audio.playEffect(zy.audio.Effect.RewardEff)
        // 执行金币落袋的动画
        coinNodeList.forEach((item, idx) => {
            item.node.runAction(
                cc.sequence(
                    cc.moveTo(0.3, item.mdPos),
                    cc.delayTime(idx * 0.01),
                    cc.moveTo(0.5, item.edPos),
                    cc.callFunc(() => {
                        this._coinPool.put(item.node);
                        coinNodeList.splice(coinNodeList.indexOf(item), 1)
                        if (!coinNodeList.length) {
                            zy.event.emit(zy.eventData.EventConst.UpdateGold)
                        }
                    })
                )
            );
        });
    },

    /**
     * 以某点为圆心，生成圆周上等分点的坐标
     *
     * @param {number} r 半径
     * @param {cc.Vec2} pos 圆心坐标
     * @param {number} count 等分点数量
     * @param {number} [randomScope=80] 等分点的随机波动范围
     * @returns {cc.Vec2[]} 返回等分点坐标
     */
    getCirclePoints(r, pos, count, randomScope = 60) {
        let points = [];
        let radians = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            let x = pos.x + r * Math.sin(radians * i);
            let y = pos.y + r * Math.cos(radians * i);
            points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        }
        return points;
    },
    init(params) {
        cc.log(this._gameStart)
        this.smallBalls = [];
        this.tmpBalls = []; // 发射的尚未添加到大球上的小球
        this._resIndex = [0, 1, 2]
        // this._bigSpeed = 0;
        this.bigOrientation = zy.utils.arrayRandomValue([-1, 1])
        this._curLevel = 1
        this.updateSmallBallPF(zy.dataMng.userData.getUseKnife())
        for (let index = 0; index < this.brokenBorn.childrenCount; index++) {
            const element = this.brokenBorn.children[index];
            this._brokenPos[index] = element.getPosition()
        }
        this.loadLevel(1);
        this.updateScore(0)
        this.bigBall.zIndex = 1
    },
    addEventListener() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchStart, this);
        // 游戏结束
        zy.event.on(zy.eventData.EventConst.GameOver, () => {
            this._gameStart = false;
        }, this);
        // 金币飞入
        zy.event.on(zy.eventData.EventConst.CoinIn, (startNode) => {
            this.playAnim(startNode)
        }, this);
        // 重新开始
        zy.event.on(zy.eventData.EventConst.Restart, () => {
            this._gameStart = true;
            if (this._gameStart) {
                this._gameStart = false;
                zy.ui.tip.show("即将重新开始");
                this._curLevel = 1
                this.updateScore(0)
                this.scheduleOnce(() => {
                    this.loadLevel(this._curLevel);
                }, 1);
            }
        }, this);
        // 更新分数
        zy.event.on(zy.eventData.EventConst.UpdateScore, (score) => {
            this.updateScore(score)
        }, this);
        // 道具选择
        zy.event.on(zy.eventData.EventConst.SelectProp, (propId) => {
            cc.log("道具选择")
            this.updateSmallBallPF(propId)
        }, this);
    },
    updateSmallBallPF(knifeId) {
        cc.log(knifeId)
        this.smallBallPF = cc.instantiate(this.smallBallPFArr[knifeId - 1]);
        cc.loader.loadRes(`new/knife/knife${knifeId}`, cc.SpriteFrame, (err, spf) => {
            if (!err) {
                cc.log(spf)
                this.placeholder.getComponent(cc.Sprite).spriteFrame = spf;
            }
        });
    },
    loadLevel(l) {
        let data = zy.dataMng.levelData.getLevelData(l - 1);
        this.bigOrientation = zy.utils.arrayRandomValue([-1, 1])
        // 大于30 速度 30 小于30 线性增长
        this.bigSpeed = 1 >= 30 ? 3 : l / 10 + 1
        this.levelLabel.string = "第 " + l + " 关";
        // 清空数据
        for (let b of this.tmpBalls) {
            b.destroy();
        }
        for (let b of this.smallBalls) {
            b.destroy();
        }
        this.tmpBalls.splice(0);
        this.smallBalls.splice(0);
        let diskFreq = zy.dataMng.commonData.getCommonData().diskFreq
        if (l % diskFreq == 0) {
            this.brokenBorn.destroyAllChildren()
            var shift = this._resIndex.shift()
            this._resIndex.push(shift)
            let diskRes = this._resIndex[0]
            this.brokenBorn = cc.instantiate(this.brokenPrefab[diskRes])
            this.brokenBorn.parent = this.broken
            this.bigBallBG.getComponent(cc.Sprite).spriteFrame = this.bigBallBGSF[diskRes]
        }
        cc.log("通关刀数", data.passKnife, this.broken, data, !this.broken.getChildByName(data.diskRes))
        for (let i = 0; i < data.passKnife; i++) {
            let ball = cc.instantiate(this.bullet);
            ball.parent = this.bulletBox;
            this.smallBalls.push(ball);
        }
        this.loadBigBall(data.hindranceKnife, data.reward);
        this.bigBall.active = true
        this.bigBallShadow.active = true
        this.broken.active = false
        this.placeholder.active = true
        this.resetBrokenPos()
        this.scheduleOnce(() => {
            this._gameStart = true;
        }, 0.1);

    },
    // 创建爆炸动画
    creatorBrokenTween(node, t, startPoint, midPoint, endPoint, cb) {
        var bezier = [startPoint, midPoint, endPoint];
        node.runAction(cc.sequence(cc.spawn(cc.rotateBy(2, 90), new cc.BezierBy(t, bezier)), cc.callFunc((node) => {
            cb()
        }, this)))
    },
    // 拷贝转盘元素 并在爆炸节点上创建
    copyQuiverToBroken() {
        for (let index = 0; index < this.quiverInBigBall.childrenCount; index++) {
            let clone = cc.instantiate(this.quiverInBigBall.children[index])
            clone.parent = this.brokenQuiver
            clone.getComponent(cc.Collider).node.group = "plate"
        }
    },
    // 爆炸节点子元素添加动画
    addTweenForBrokenChildren() {
        zy.audio.playEffect(zy.audio.Effect.DiskBrokenEff)
        let tween = [...this.brokenBorn.children, ...this.brokenQuiver.children]
        tween.forEach((element, index) => {
            let start = element.getPosition()
            // 方向
            let dir = start.x >= 0 ? -1 : 1
            let mid = cc.v2(-174.12 * dir, 500)
            let end = cc.v2(-284.386 * dir, -cc.winSize.height - element.height)
            this.creatorBrokenTween(element, 1, start, mid, end, () => {
                if (index >= tween.length - 1) {
                    this.brokenQuiver.destroyAllChildren()
                    // 下一关
                    this._next()
                }
            })
        })
    },
    // 重置爆炸节点位置
    resetBrokenPos() {
        for (let index = 0; index < this.brokenBorn.childrenCount; index++) {
            const element = this.brokenBorn.children[index];
            element.setPosition(this._brokenPos[index])
            element.angle = 0
        }
    },
    start() {
        this.iconNode.addChild(cc.instantiate(this.iconPrefab))
        let mng = cc.director.getCollisionManager();
        mng.enabled = true;
        mng.enabledDebugDraw = false;
        this.addEventListener()
        this.init()
        // zy.audio.setBGMVolume(0.5)
        // zy.audio.playBGM(zy.audio.BGM.Game, true)
    },
    loadBigBall(knife, reward) {
        this.quiverInBigBall.destroyAllChildren();
        let radius = this.bigBall.width / 2 - 2;
        let counts = knife + zy.utils.randomInteger(reward[0], reward[1])
        let degree = 360 / counts;
        // 小刀 + 奖励
        cc.log(`小刀:${knife}-奖励:${counts - knife}`)
        let pinCount = []
        for (let index = 0; index < counts - knife; index++) {
            pinCount.push(cc.instantiate(this.boxPrefab));
        }
        for (let index = 0; index < knife; index++) {
            pinCount.push(cc.instantiate(this.smallBallPF));
        }
        for (let i = 0; i < counts; i++) {
            let randomEle = zy.utils.arrayRandomValue(pinCount)
            let randomEleIndex = pinCount.indexOf(randomEle)
            if (randomEleIndex != -1) {
                pinCount.splice(randomEleIndex, 1)
            }
            let ball = randomEle;
            let radian = cc.misc.degreesToRadians(i * degree);
            let x = radius * Math.sin(radian);
            let y = radius * Math.cos(radian);
            ball.x = x;
            ball.y = y;
            ball.parent = this.quiverInBigBall;
            // 计算旋转角度
            ball.angle = 180 - i * degree;
            // ball.getChildByName("numLabel").active = false;
        }
    },

    onTouchStart(event) {
        if (!this._gameStart) {
            return;
        }
        if (this.smallBalls.length > 0) {
            let bullet = this.smallBalls.shift();
            let wordPos = this.placeholder.parent.convertToWorldSpaceAR(this.placeholder.getPosition());

            let ball = cc.instantiate(this.smallBallPF);
            ball.getComponent("Knife")._isInserset = false
            // ball.getComponentInChildren(cc.Label).string = bullet.getComponentInChildren(cc.Label).string;
            ball.parent = this.bigBall.parent;
            ball.position = this.bigBall.parent.convertToNodeSpaceAR(wordPos);
            this.tmpBalls.push(ball);
            bullet.destroy();
            this.placeholder.active = false
            let radius = this.bigBall.height / 2 - 2;
            let des = cc.v2(0, this.bigBall.y - radius + 5);
            ball.runAction(cc.sequence(cc.moveTo(zy.dataMng.commonData.getCommonData().knifeRunSpeed, des).easing(cc.easeSineOut()), cc.callFunc(() => {
                cc.log("飞行结束")
                this.placeholder.active = true
                ball.getComponent("Knife")._isInserset = true
                zy.audio.playEffect(zy.audio.Effect.InsertEff)
                // this.bigBall.runAction(cc.sequence(cc.moveBy(0.05, 0, 20), cc.moveBy(0.05, 0, -20)));
                this.disk.runAction(cc.sequence(cc.moveBy(0.05, 0, 20), cc.moveBy(0.05, 0, -20)));
                zy.event.emit(zy.eventData.EventConst.UpdateScore, zy.dataMng.userData.getScore() + 1);
                cc.log(zy.dataMng.userData.getScore() , zy.dataMng.userData.maxScore)
                if (zy.dataMng.userData.getScore() > zy.dataMng.userData.maxScore) {
                    zy.dataMng.userData.maxScore = zy.dataMng.userData.getScore()
                    zy.dataMng.userData.isNewrecord = true
                    // 提交分数
                    WxCloundAPI.updateUserInfo({ score: zy.dataMng.userData.maxScore || 0 }, false).then(() => {
                        this.submitScoreButtonFunc()
                    })
                }
                this.tmpBalls.shift();
                ball.parent = this.quiverInBigBall;
                let angle = this.bigBall.angle;
                angle = angle % 360 + 180;
                let radian = cc.misc.degreesToRadians(angle);

                let x = radius * Math.sin(radian);
                let y = radius * Math.cos(radian);
                ball.x = x;
                ball.y = y;
                ball.angle = 180 - angle;
                this.scheduleOnce(this._checkPass.bind(this), 0);
            })));
        }
    },
    _checkPass() {
        if (this._gameStart && this.smallBalls.length == 0) {
            this.broken.active = true
            this.bigBall.active = false
            this.bigBallShadow.active = false
            this.copyQuiverToBroken()
            this.addTweenForBrokenChildren()
            // zy.dataMng.userData.curLevel = this._curLevel;
        }
    },
    _next() {
        this._gameStart = false;
        let des = "恭喜过关，即将进入下一关";
        // const max = zy.dataMng.levelData.getMaxLevel();
        // if (this.curLevel < max) {
        this._curLevel += 1;
        // } else {
        //     des = "恭喜你通关了";
        // }
        // zy.ui.tip.show(des);
        // this.scheduleOnce(() => {
        this.loadLevel(this._curLevel);
        // }, 1);
    },
    // update (dt) {},
    lateUpdate(dt) {
        if (!this._gameStart) {
            return;
        }
        this.bigBall.angle += this.bigOrientation * this.bigSpeed;
    },
    backHome() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        // zy.audio.stopBGM()
        zy.director.loadScene("mainScene")
    },
    updateScore(score) {
        if (!isNaN(score)) {
            zy.dataMng.userData.setScore(score);
        }
        this.score.string = `${zy.dataMng.userData.getScore()}`
    },
    submitScoreButtonFunc() {
        let score = zy.dataMng.userData.getScore() || 0;
        cc.log("发消息给子域")
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: `${envConfig[env].score}x1`,
                score: score,
            });

        }
        cc.log("提交得分: x1 : " + score)
    },
});
