cc.Class({
    ctor() {
        this.dataObj = null;
        this.fileDir = "";  // 配置文件路径
    },

    initData(data) {
        if (!data) {
            return;
        }

        this.dataObj = data;
    }

});