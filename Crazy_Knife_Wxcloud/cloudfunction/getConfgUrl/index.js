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

  // 以 version 作为记录 id
  const docId = `version`

  let configInfo
  try {
    const querResult = await db.collection('config').doc(docId).get()
    configInfo = querResult.data
  } catch (err) {
    // 用户未初始化
    return err
  }

  if (configInfo) {
    console.log(configInfo)
    return {
      success: true,
      url: configInfo.version
    }
  } else {
    return {
      success: false
    }
  }
}