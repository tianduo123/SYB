// pages/index/index.js
let api = require('../../request/api.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: api.API_IMG,
    show:true
  },
  //获取首页3大分类
  getClass(){
    wx.request({
      url: api.getClass(),
      success:(res)=>{
        console.log(res)
        this.setData({
          jishikan:res.data.re[0],
          zhudake:res.data.re[1],
          shenlin:res.data.re[2]
        })
      }
    })
  },
  //获取用户信息
  getUserInfo(res) {
    console.log(res)
    if (res.detail.rawData) {
      //将用户信息存到缓存
      wx.setStorage({
        key: 'userInfo',
        data: res.detail.userInfo,
      })
      this.setData({
        isShow: false
      })
      //调用接口保存用户授权信息
      wx.request({
        url: api.saveUser(app.globalData.openid, res.detail.userInfo.nickName, res.detail.userInfo.avatarUrl),
        success: (res) => {
          console.log(res)
        }
      })
    }
  },
  //首页顶部轮播图
  getBanner(){
    wx.request({
      url: api.getBanner(),
      success: (res) => {
        console.log('顶部轮播图', res)
        this.setData({
          bannerList: res.data.re
        })
      }
    })

  },
  //轮播详情
  toGoodsDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: `/pages/goods_detail/goods_detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  //每日即时看
  look() {
    console.log('每日即时看')
    wx.navigateTo({
      url: `/pages/everyday/everyday`,
    })
  },
  //主打课程
  tokc(e) {
    console.log('跳转主打课程二级页面', e)
    wx.navigateTo({
      url: `../video_list/video_list?status=${e.currentTarget.dataset.status}`,
    })
  },
  //身临其境
  toslqj(e) {
    console.log('跳转身临其境二级页面', e)
    wx.navigateTo({
      url: `../video_list/video_list?status=${e.currentTarget.dataset.status}`,
    })
  },
  //跳转省银子儿
  toPintuan() {
    wx.request({
      url: api.hasPin(),
      success: (res) => {
        console.log('查看是否开通省银子小程序', res)
        if (res.data.re.pin == 1) {
          wx.navigateToMiniProgram({
            appId: 'wx3950a029465d5070',
            extraData: {
              admin_id: 15
            },
            envVersion: 'release',
            success: (res) => {
              console.log(res)
            },
            fail: (res) => {
              console.log(res)
            }
          })
        } else {
          wx.showToast({
            title: '暂无优惠活动',
            image: '../../icon/cry.png'
          })
        }
      }
    })

  },
  //跳转小游戏
  togame(){
    wx.navigateToMiniProgram({
      appId: 'wx9f726f8d93b57acd',
      envVersion: 'trial',
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },
  //离我最近
  tonear() {
    //获取用户的授权状态
    wx.getSetting({
      success: (res) => {
        //判断scope.userLocation是否为true
        console.log(res)
        if (res.authSetting["scope.userLocation"]) {
          //如果授权过直接跳转附近商家列表
          wx.navigateTo({
            url: `../near/near?lat=${this.data.lat}&lon=${this.data.lon}`,
          })
        } else {
          //用户没有授权，引导用户授权
          wx.openSetting({
            success: (res) => {
              console.log(res)
              wx.getLocation({
                success: (res) => {
                  console.log(res)
                  this.setData({
                    lat: res.latitude,
                    lon: res.longitude
                  })
                  wx.navigateTo({
                    url: `../near/near?lat=${res.latitude}&lon=${res.longitude}`,
                  })
                  //拿到用户经纬度获取附近商家列表
                  wx.request({
                    url: api.nearList(res.latitude, res.longitude),
                    success: (res) => {
                      console.log(res)
                      this.setData({
                        near: res.data
                      })
                      console.log(this.data.near)
                    }
                  })
                },
              })
            }
          })
        }
      }
    })
  },
  //新人福利跳转注册页
  tologin(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取首页3大分类
    this.getClass()
    //判断当前商家是否开通省银子功能
    wx.request({
      url: api.hasPin(),
      success:(res)=>{
        console.log('判断当前商家是否开通省银子功能',res)
      }
    })
    //获取拼团商品轮播
    wx.request({
      url: api.getBanner2(),
      success:(res)=>{
        console.log('拼团商品是',res)
        this.setData({
          groupList:res.data.re
        })
      }
    })
    //获取首页轮播
    this.getBanner()
    //获取用户经纬度（显示附近商家需要）
    wx.getLocation({
      success: (res) => {
        console.log(res)
        this.setData({
          lat: res.latitude,
          lon: res.longitude
        })
        wx.request({
          url: api.nearList(res.latitude,res.longitude),
          success:(res)=>{
            console.log('附近商家列表',res.data.re)
            this.setData({
              list:res.data.re.slice(0,4)
            })
            console.log('截取后的数组',this.data.list)
          }
        })
      },
    })
    //获取屏幕高度（显示用户授权蒙层需要）
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.screenHeight)
        this.setData({
          Height: res.screenHeight
        })
        app.globalData.Height = res.screenHeight
      },
    })
    //获取新人福利广告
    wx.request({
      url: api.newP(),
      success:(res)=>{
        console.log(res)
        this.setData({
          msg:res.data.re.title
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   wx.getStorage({
     key: 'userId',
     success:(res)=>{
       console.log('userId是',res)
       if(res.data){
         this.setData({
           show:false
         })
       }
     },
   })
    //从缓存中拿用户userInfo数据
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log('拿到授权信息')
        //拿到用户微信信息 --> 不显示授权蒙层
        this.setData({
          isShow: false
        })
      },
      fail: (res) => {
        console.log('没拿到授权信息')
        //没拿到用户微信信息 --> 显示授权蒙层
        this.setData({
          isShow: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('用户下拉刷新')
    wx.showLoading({
      title: '努力加载中...',
      success:()=>{
        //重新获取首页轮播
        this.getBanner()
        setTimeout(()=>{
          wx.hideLoading()
          wx.stopPullDownRefresh()
        },1500)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})