//app.js
let api = require('./request/api.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        wx.request({
         url:api.getOpenid(this.globalData.appid, this.globalData.secret, res.code),
         success:(res)=>{
           console.log('openid是--------',res.data.openid)
           this.globalData.openid = res.data.openid
         }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // console.log('hahahahah')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(this.globalData.userInfo)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //强制用户更新小程序
    //获取更新管理对象
    const updateManager = wx.getUpdateManager()
    //检查是否有新版本
    updateManager.onCheckForUpdate(res=>{
      // console.log('检查是否有新版本',res)
    })
    //监听小程序有新版本
    updateManager.onUpdateReady(res=>{
      // console.log(res)
      wx.showModal({
        title: '更新提示',
        content: '新版本已准备好,是否重新应用？',
        success:(res)=>{
          if(res.confirm){
            //新版本已经下载好，强制更新
            updateManager.applyUpdate()
          }
        }
      })
    })
    //监听小程序更新失败
    updateManager.onUpdateFailed(res=>{
      // console.log(res)
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel:false
      })
    })
  },
  globalData: {
    userInfo: null,
    appid: 'wx66314928577b3667',
    secret:'8093c9853c7b04bf5aee0c377d4db304',
    openid:'', 
    userId:''
  }
})