// pages/video_list/video_list.js
const app = getApp()
const api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: api.API_IMG
  },
  //主打课程&&身临其境视频列表
  getList(){
    //通过status来判断请求主打课程还是身临其境 0 --> 主打课程 1 --> 身临其境
    if (this.data.status == 0) {
      wx.request({
        url: api.getVideoId(),
        // url:'https://syb.shimokeji.cn/index.php/Api/index/courseIndex?admin_id=15',
        success: (res) => {
          console.log('这是主打课视频列表', res)
          this.setData({
            list: res.data.re
          })
        }
      })
    } else if (this.data.status == 1) {
      wx.request({
        url: api.getFunctional(),
        // url:'https://syb.shimokeji.cn/index.php/Api/index/edu?admin_id=15',
        success: (res) => {
          console.log('这是身临其境视频列表', res)
          this.setData({
            list: res.data.re
          })
        }
      })
    } else {
      console.log('请求失败！')
    }
  },
  //主打课程详情
  toDetail(e){
    console.log('这是主打课详情',e)
    wx.navigateTo({
      url: `/pages/video_detail/video_detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  //身历其境详情
  toDetail2(e) {
    console.log('这是身临其境详情')
    wx.navigateTo({
      url: `../slqj_detail/slqj_detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      status:options.status
    })
    this.getList()
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
      success: () => {
        //重新获取首页轮播
        this.getList()
        setTimeout(() => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        }, 1500)
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