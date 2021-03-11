// initWXCloud
// 初始化微信云函数
function initWXCloud() {
  if (cc.sys.platform !== cc.sys.WECHAT_GAME) return
  let envVersion = wx.getAccountInfoSync().miniProgram.envVersion
  env = envVersion
  wx.cloud.init({
    env: envConfig[env].envId
  });
}
/**
 * getPlayerInfo 获取玩家信息
 */
function getPlayerInfo() {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      zy.ui.loading.show('getPlayerInfo')
      wx.cloud.callFunction({
        name: 'getPlayerInfo',
        success: (res) => {
          if (res.result) {
            resolve(res.result);
          } else {
            reject(res);
          }
          zy.ui.loading.hide('getPlayerInfo')
        },
        fail: (err) => {
          reject(err);
        }
      });
    } else {
      reject("platform is not WECHAT_GAME");
    }
  });
}
/**
 * 更新用户信息(金币gold 选择的刀useKnife 拥有的刀集合ownKnife)
 * @param  data 
 */
function updateUserInfo(data, isShowloading = true) {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      if (isShowloading) zy.ui.loading.show('updateUserInfo')
      wx.cloud.callFunction({
        name: 'updateUserInfo',
        data,
        success: (res) => {
          if (res.result) {
            resolve(res.result);
          } else {
            reject(res);
          }
          zy.ui.loading.hide('updateUserInfo')
        },
        fail: (err) => {
          reject(err);
        }
      });
    } else {
      resolve("platform is not WECHAT_GAME");
    }
  });
}
/**
 * getConfgUrl 获取配置表url
 */
function getConfgUrl() {
  return new Promise((resolve, reject) => {
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      zy.ui.loading.show('getConfgUrl')
      wx.cloud.callFunction({
        name: 'getConfgUrl',
        success: (res) => {
          if (res.result) {
            resolve(res.result);
          } else {
            reject(res);
          }
          zy.ui.loading.hide('getConfgUrl')
        },
        fail: (err) => {
          reject(err);
        }
      });
    } else {
      reject("platform is not WECHAT_GAME");
    }
  });
}

/**
 * promise化接口
 */
function wxPromisify(functionName, params) {
  return new Promise((resolve, reject) => {
    wx[functionName]({
      ...params,
      success: res => resolve(res),
      fail: res => reject(res)
    });
  });
}

/**
 * 登录
 */
function login(params = {}) {
  return wxPromisify('login', params);
}

/**
 * 获取用户信息
 */
function getUserInfo(params = {}) {
  return wxPromisify('getUserInfo', params);
}

/**
 * 获取用户权限
 */
function getSetting(params = {}) {
  return wxPromisify('getSetting', params);
}
export default {
  initWXCloud,
  getConfgUrl,
  getPlayerInfo,
  updateUserInfo,
  login,
  getUserInfo,
  getSetting,
}
