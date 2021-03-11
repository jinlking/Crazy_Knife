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

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
  // 以 openid-user 作为记录 id
  const docId = `${wxContext.OPENID}-user`

  let userInfo
  let initdata = {
    // 这里指定了 _id，如果不指定，数据库会默认生成一个
    _id: docId,
    // 这里指定了 _openid，因在云函数端创建的记录不会默认插入用户 openid，如果是在小程序端创建的记录，会默认插入 _openid 字段
    _openid: wxContext.OPENID,
    // 金币数量
    gold: 0,
    // 选择的刀
    useKnife: 1,
    // 拥有的刀
    ownKnife: [1],
    // 分数
    score: 0,
    // 签到天数
    sign: 0,
    // 上次签到时间戳
    signTime: ''
  }
  try {
    const querResult = await db.collection('user').doc(docId).get()
    userInfo = querResult.data
    const addNewField = {}
    const newField = { score: 0, sign: 0, signTime: '' }
    for (const key in newField) {
      if (!userInfo.hasOwnProperty(key)) {
        addNewField[key] = newField[key]
      }
    }
    if (Object.keys(addNewField).length) {
      db.collection('user').doc(docId).update({
        data: addNewField
      })
    }
  } catch (err) {
    // 用户未初始化
    console.log("用户未初始化", err)
  }

  if (!userInfo) {
    // 创建新的用户记录
    await db.collection('user').add({
      // data 是将要被插入到 user 集合的 JSON 对象
      data: initdata
    })
    return initdata
  } else {
    return userInfo
  }

}