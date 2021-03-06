// pages/login/login.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '获取验证码',
    timer_num: 60,

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
  //手机号
  getPhone(e) {
    console.log(e)
    this.setData({
      userPhone: e.detail.value
    })
  },
  //密码
  getPsd(e) {
    this.setData({
      userPassWord: e.detail.value
    })
  },
  //确认密码
  getPsd2(e) {
    console.log(e)
    this.setData({
      userPassWord2: e.detail.value
    })
  },
  //获取验证码
  getcode() {
    //判断用户手机号是否合法
    if ((!(/^1[34578]\d{9}$/.test(this.data.userPhone)))) {
      wx.showToast({
        title: '手机号输入有误',
        icon: 'none'
      })
    } else if (!this.data.userPassWord) {
      wx.showToast({
        title: '密码不能为空哦~',
        icon: 'none'
      })
    } else if (!this.data.userPassWord2) {
      wx.showToast({
        title: '请再次输入您的密码',
        icon: 'none'
      })
    } else if (this.data.userPassWord != this.data.userPassWord2) {
      wx.showToast({
        title: '两次密码输入不一致哦~',
        icon: 'none'
      })
    } else {
      this.setData({
        msg: '已发送'
      })
      //发短信
      wx.request({
        url: api.getcode(this.data.userPhone),
        success: (res) => {
          console.log(res)
          this.setData({
            code: res.data.code
          })
        }
      })
      //启动定时器     
      var timer = setInterval(() => {
        this.setData({
          timer_num: this.data.timer_num - 1
        })
        // console.log(this.data.timer_num)
        if (this.data.timer_num == 0) {
          //关闭定时器
          clearInterval(timer)
          console.log('关闭定时器')
          this.setData({
            msg: '获取验证码',
            timer_num: 60
          })
        }
      }, 1000)
    }
  },
  //获取用户输入的验证码
  userCode(e){
    console.log(e)
    if(e.detail.value.length==4){
      this.setData({
        isLogin:true,
        userCode:e.detail.value
      })
    }
  },
  //注册
  register(e){
    console.log(e)
    //前端判断用户输入的验证码是否正确
    if (this.data.code == e.detail.value.usercode){
      //输入正确，调用接口
      wx.request({
        url: api.register(app.globalData.openid, e.detail.value.phone,e.detail.value.psd),
        success:(res)=>{
          console.log(res)
          if(res.data.status==0){
            console.log('注册失败')
            wx.showToast({
              title: '发生了一个未知错误，请稍后再试',
              icon:'none'
            })
          }else if(res.data.status==1){
            console.log('注册成功')
            //判断是否是新用户
            if (res.data.first == 0) {
              //新用户
              console.log('新用户，赠送积分')
              app.globalData.newP = true,
              app.globalData.score = res.data.num
            } else {
              //老用户
              console.log('老用户，不赠送积分')
            }
            wx.showToast({
              title: '注册成功',
              success:(res)=>{
                setTimeout(function(){
                  wx.redirectTo({
                    url: '../login/login',
                  })
                },1000)
                this.setData({
                  val:'',
                  val2:'',
                  psd:'',
                  psd2:''
                })
              }
            })
          }else if (res.data.status==2){
            console.log('该手机号已注册')
            wx.showModal({
              title: '登录',
              content: '该手机号已注册，快去登录吧',
              success:(res)=>{
                if(res.confirm){
                  wx.redirectTo({
                    url: '../login/login',
                  })
                }else{
                  console.log('用户点击了取消')
                }
              }
            })
          }else if(res.data.status==3){
            wx.showToast({
              title: '一个微信号只能注册一次哦',
              icon:'none'
            })
          }
        }
      })
    }else{
      //输入错误 --> 提示
      wx.showToast({
        title: '验证码错误，请重新输入',
        icon: 'none'
      })
    }
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