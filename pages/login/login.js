// pages/login/login.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从缓存中拿用户微信头像
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.data
        })
      },
    })
  },
  //获取用户输入的手机号
  userPhone(e){
    // console.log(e)
    this.setData({
      userPhone:e.detail.value
    })
  },
  //获取用户输入的密码
  userPsd(e){
    // console.log(e)
    this.setData({
      userPsd:e.detail.value
    })
    //改变登录按钮样式
    if(e.detail.value){
      this.setData({
        isLogin: true
      })
    }else{
      this.setData({
        isLogin:false
      })
    }
 
  },
  //立即注册
  register(){
    wx.redirectTo({
      url: '../register/register',
    })
  },
  //忘记密码
  forget(){
    wx.redirectTo({
      url: '../forgetPsd/forgetPsd',
    })
  },
  //登录
  login(e) {
    console.log(e)
    wx.request({
      url: api.login(e.detail.value.phone,e.detail.value.psd),
      success: (res) => {
        console.log(res)
        if(res.data.status==0){
          wx.showToast({
            title: '用户名或密码错误',
            icon:'none'
          })
        }else if(res.data.status==1){
          //登录成功，将userId存到缓存
          wx.setStorage({
            key: 'userId',
            data:res.data.data.id,
          })
          wx.showToast({
            title: '登录成功',
            success:()=>{
              setTimeout(function(){
                wx.switchTab({
                  url: '../qiandao/qiandao',
                })
                this.setData({
                  val:'',
                  psd:''
                })
              },1000)
            }
          })
        }else{
          wx.showToast({
            title: '发生了一个未知错误',
            icon:'none'
          })
        }
        // if (res.data.status == 1) {
        //   //注册成功，将userId存到缓存
        //   wx.setStorage({
        //     key: 'userId',
        //     data: res.data.data,
        //     success: () => {
        //       console.log('存储成功')
        //     },
        //     fail: () => {
        //       console.log('存储失败')
        //     }
        //   })
        //   wx.showToast({
        //     title: '登录成功',
        //     success: () => {
        //       setTimeout(() => {
        //         console.log('跳转到我的页面')
        //         wx.switchTab({
        //           url: `../qiandao/qiandao`,
        //         })
        //         this.setData({
        //           val: '',
        //           val2: ''
        //         })
        //       }, 1500)

        //     }
        //   })
        // }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})