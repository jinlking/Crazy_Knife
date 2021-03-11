/**
 *
 * 数据管理, 配置数据读取, 保存读取本读数据
 */

let LevelData = require("./LevelData");
let UserData = require("./UserData");
let PropData = require("./PropData");
let ShopData = require("./ShopData");
let DataBase = require("./DataBase");
let SignData = require("./SignData");
let CommonData = require("./CommonData");

cc.Class({
    ctor() {
        this.loadCounts = 0;

        // todo: 每添加新的配置表都需要在这里创建对应的对象
        this.levelData = new LevelData();

        this.propData = new PropData();

        this.shopData = new ShopData();

        this.signData = new SignData();
        
        this.commonData = new CommonData();
        // 动态数据
        this.userData = new UserData();
    },

    /**
     * 读取本地配置文件
     * @param progressCb(cur,total) 进度回调
     * @param completeCb{Function} 读取结束回调
     */
    loadDataFromLocalFile(progressCb, completeCb) {
        // 读取本地保存的用户数据
        this.loadSavedData();

        // 读取配置文件数据
        let keys = Object.keys(this);
        cc.log("====keys1: %s", JSON.stringify(keys));
        keys = keys.filter((k) => {
            return this.hasOwnProperty(k) && (this[k] instanceof DataBase);
        });
        cc.log("====keys2: %s", JSON.stringify(keys));

        for (let key of keys) {
            let obj = this[key];
            let fileName = obj.fileDir;
            cc.loader.loadRes(fileName, cc.JsonAsset, (err, data) => {
                if (err) {
                    cc.error("load local data: " + fileName + ", error: " + err);
                } else {
                    if (obj.initData) {
                        obj.initData.call(obj, data.json);
                    }
                }

                this.loadCounts++;
                if (progressCb) {
                    progressCb(this.loadCounts, keys.length);
                }
                if (this.loadCounts >= keys.length) {

                    if (completeCb) {
                        completeCb();
                    }
                }
            });
        }
    },

    // 从localStorage读取数据
    loadSavedData() {
        this.userData.loadData();
    },
    // 保存数据到localStorage
    saveDataToLocal() {
        this.userData.saveData();
    },
    /** 初始化配置表 */
    initConfigs(url) {
        return new Promise((resolve, reject) => {
            cc.loader.load({ url: url, type: "binary" }, (err, zipData) => {
                return JSZip.loadAsync(zipData).then((zip) => {
                    let len = Object.keys(zip.files).length
                    let promiseArr = []
                    for (let key in zip.files) {
                        let file = zip.file(zip.files[key].name)
                        if (!file) continue
                        promiseArr.push(((fileObject) => {
                            return fileObject.async('text').then(res => {
                                let fileName = zip.files[key].name.replace(".json", "")
                                if (fileName == "Level") {
                                    this.levelData.initData(JSON.parse(res));
                                } else if (fileName == "Prop") {
                                    this.propData.initData(JSON.parse(res));
                                } else if (fileName == "Shop") {
                                    this.shopData.initData(JSON.parse(res));
                                } else if (fileName == "Sign") {
                                    this.signData.initData(JSON.parse(res));
                                } else if (fileName == "Common") {
                                    this.commonData.initData(JSON.parse(res));
                                }
                                // if (this._typeDic.indexOf(fileName) != -1) {
                                //     var configObj = this._typeDic[fileName];
                                //     this._dic[fileName] = JSON.parse(res)
                                // }
                                cc.log(fileName)
                            }, (data) => {
                                console.error(data)
                            })
                        })(file))
                    }
                    return Promise.all(promiseArr).then(() => {
                        cc.log("All config load finished", this.levelData, this.propData, this.shopData)
                        resolve()
                    }, (data) => {
                        console.error(data)
                        reject()
                    })
                }, (data) => {
                    console.error('no：', data)
                    reject()
                })
            })
        })
    }
});
