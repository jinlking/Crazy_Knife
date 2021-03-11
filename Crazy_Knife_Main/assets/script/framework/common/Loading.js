

let Loading = cc.Class({
    extends: cc.Component,

    statics: {
        // loading
        loadingNode: null,
        animationNode: null,
        loadingComponent: null,

        // 显示Loading
        show: function (loadingName) {
            if (!cc.isValid(this.loadingNode)) {
                this.loadingNode = zy.Node.createNode({
                    name: 'loading',
                    width:  cc.winSize.width,
                    height: cc.winSize.height,
                    zIndex: zy.constData.ZIndex.LOADING,
                    parent: zy.director.getUiRoot(),
                });
                this.loadingComponent = this.loadingNode.addComponent('Loading');
                this.loadingComponent.init();
            }

            this.loadingComponent.show(loadingName);

        },

        // 隐藏Loading
        hide: function (loadingName) {
            if (cc.isValid(this.loadingNode)) {
                this.loadingComponent.hide(loadingName);
            }
        },
    },

    properties: {},

    init: function () {
        // 当前显示的loading列表
        this.loadingList = [];

        // 控制触摸 
        this.node.width =  cc.winSize.width;
        this.node.height = cc.winSize.height;
        this.node.addComponent(cc.BlockInputEvents);

        // 黑色遮罩
        this.maskNode = zy.Sprite.createNode({
            name: 'maskNode',
            url: 'new/common/mask',
            parent: this.node,
            size: cc.size( cc.winSize.width, cc.winSize.height),
            loadCallback: function (err, node) {
                node.width =  cc.winSize.width;
                node.height = cc.winSize.height;
            }.bind(this),
        });

        // todo: loading动画
        let loading = zy.Label.createNode({
            string: "Loading...",
            parent: this.maskNode,
            systemFont: true,
        });
        loading.y = -100
        cc.loader.loadRes('prefab/common/LoadingAni', cc.Prefab, function (err, prefab) {
            if (!err) {
                this.animationNode = cc.instantiate(prefab);
                this.animationNode.parent = this.node
                if (this.animationNode) {
                    let anim = this.animationNode.getComponent(cc.Animation);
                    anim.play()
                }
            }
        }.bind(this))
        this.maskNode.active = false;
    },

    show: function (name) {
        // 存在当前loading
        if (this.loadingList.indexOf(name) == -1) {
            this.loadingList.push(name);
        }

        this.node.active = true;

        this.node.stopAllActions();

        // let delaySeq = cc.sequence(
        //     cc.delayTime(1), // 先有遮罩一秒钟后才触发loading,
        //     cc.callFunc(function () {
        //         this.delaySeq = null;
        this.maskNode.active = true;
        if (this.animationNode) {
            let anim = this.animationNode.getComponent(cc.Animation);
            anim.play()
        }
        // this.node.runAction(delaySeq);
    },

    hide: function (name) {
        // 存在当前loading
        const index = this.loadingList.indexOf(name);
        if (index > -1) {
            this.loadingList.splice(index, 1);
        }

        if (this.loadingList.length == 0) {
            this.node.active = false;
            this.maskNode.active = false;
            if (this.animationNode) {
                let anim = this.animationNode.getComponent(cc.Animation);
                anim.stop()
            }
        }
    },

    clean: function () {
        this.node.active = false;
        this.loadingList = [];
    }
});