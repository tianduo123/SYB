// pages/near/near.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:api.API_IMG
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.request({
      url: api.nearList(options.lat,options.lon),
      success:(res)=>{
        console.log(res)
        this.setData({
          nearList:res.data.re
        })
        console.log(res.data.re  instanceof Array)
      }
    })
  },
  tonear(e){
    console.log(e)
    wx.navigateTo({
      url: `../near_detail/near_detail?admin_id=${e.currentTarget.dataset.admin_id}&content=${e.currentTarget.dataset.content}&name=${e.currentTarget.dataset.name}&img=${e.currentTarget.dataset.img}`,
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