/**
 *
 * 玩家在游戏中动态修改的数据
 */

cc.Class({
    ctor() {
        this.curLevel = 1; // 当前等级
        this.gold = 2000; // 金币
        this.ownKnife = [1]; // 拥有刀的类型
        this.score = 0; //分数
        this.useKnife = 1; //选择的刀
        this.maxScore = 0; //最高分数
        this.signed = 0; // 签到天数
        this.signedTime = ''; // 签到时间戳
        this.isNewrecord = false
    },

    saveData() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) return
        let obj = {};
        for (let key of Object.keys(this)) {
            obj[key] = this[key];
        }
        let data = JSON.stringify(obj);
        cc.sys.localStorage.setItem(zy.constData.StaticKey.PlayerDataKey + zy.constData.StaticKey.SaveDataVersion, data);
        cc.log("save data", data)
    },

    loadData() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) return
        let data = cc.sys.localStorage.getItem(zy.constData.StaticKey.PlayerDataKey + zy.constData.StaticKey.SaveDataVersion);
        if (data) {
            data = JSON.parse(data);
            for (let key of Object.keys(data)) {
                if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
        }
        cc.log("load data", data)
    },
    clear() {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) return
        cc.sys.localStorage.setItem(zy.constData.StaticKey.PlayerDataKey + zy.constData.StaticKey.SaveDataVersion, "");
    },
    getGold() {
        return this.gold;
    },
    setGold(count) {
        this.gold = count
    },
    getSigned() {
        return this.signed;
    },
    setSigned(day) {
        this.signed = day
    },
    getSignedTime() {
        return this.signedTime;
    },
    setSignedTime(time) {
        this.signedTime = time
    },
    getScore() {
        return this.score;
    },
    setScore(score) {
        this.score = score
    },
    getUseKnife() {
        return this.useKnife;
    },
    setUseKnife(knifeId) {
        this.useKnife = knifeId
    },
    /**
     * 是否拥有道具
     */
    isOwnProp(propId) {
        return this.ownKnife.indexOf(propId) != -1
    },
    /**
     * 获取拥有的道具
     */
    getOwnProp() {
        return this.ownKnife
    },
    /**
     * 添加拥有道具
     */
    addOwnProp(propId) {
        if (zy.dataMng.propData.getPropById(propId)) {
            if (this.ownKnife.indexOf(propId) == -1) {
                this.ownKnife.push(propId)
            }
        } else {
            cc.log(`添加道具失败 找不到 道具 ${propId}`)
        }
    },
    /**
     * 初始化数据
     */
    initData(gold, useKnife, ownKnife, maxscore, signed, signedTime) {
        this.gold = gold
        this.useKnife = useKnife
        this.ownKnife = ownKnife
        this.maxScore = maxscore
        this.signed = signed
        this.signedTime = signedTime
    }
});