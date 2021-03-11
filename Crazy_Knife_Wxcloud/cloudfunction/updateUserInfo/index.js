// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
// 可在入口函数外缓存 db 对象
const db = cloud.database()

// 数据库查询更新指令对象
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 以 openid-user 作为记录 id
  const docId = `${wxContext.OPENID}-user`
  const data = event
  const key = ["gold", "useKnife", "ownKnife", "sign", "signTime"]
  const updateInfo = {}
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      if (key.includes(key)) {
        updateInfo[key] = element
      }
    }
  }
  try {
    await db.collection('user').doc(docId).update({
      data: updateInfo
    })
    return {
      success: true
    }
  } catch (err) {
    // 用户未初始化
    return {
      success: false
    }
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}