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
        list: {
            default: null,
            type: cc.Node,
            tooltip: "商品列表容器"
        },
        itemPrefab: {
            default: null,
            type: cc.Prefab,
            tooltip: "商品预制体"
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onEnable(){
        cc.log("--------///")
    },
    onLoad () {
        cc.log("--------")
    },

    start() {
        let data = zy.dataMng.shopData.getAllShop();
        this.list.removeAllChildren()
        data.forEach(e => {
            let item = cc.instantiate(this.itemPrefab)
            item.getComponent("ShopItem").init(e)
            this.list.addChild(item)
        });
    },
    closeHandler() {
        zy.audio.playEffect(zy.audio.Effect.CommonClick)
        zy.director.closePop("prefab/shop/Shop")
    }
    // update (dt) {},
});
