cc.Class({
    extends: cc.Component,
    properties: {
        backSprite: cc.Node,
        rankLabel: cc.Label,
        top3: cc.Sprite,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
        top3SpriteFrame: [cc.SpriteFrame]
    },
    start() {

    },

    init: function (rank, data) {
        let avatarUrl = data.avatarUrl;
        // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        this.rankLabel.node.active = false
        this.top3.node.active = false
        cc.log([0, 1, 2].indexOf(rank) != -1)
        if ([0, 1, 2].indexOf(rank) != -1) {
            this.top3.node.active = true
            this.top3.spriteFrame = this.top3SpriteFrame[rank]
        } else {
            this.rankLabel.node.active = true
        }
        this.rankLabel.string = (rank + 1).toString();
        this.createImage(avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = grade.toString();
    },
    createImage(avatarUrl) {
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
                image.src = avatarUrl;
            } catch (e) {
                cc.log(e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }

});