// pages/slqj_detail/slqj_detail.js
let app = getApp()
let api = require('../../request/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:api.API_IMG,
    val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id
    })

    //获取评论列表
    wx.request({
      url: api.commentList2(options.id),
      success:(res)=>{
        console.log(res)
        this.setData({
          commentList:res.data.re,
          num:res.data.re.length
        })
      }
    })
  },
  //用户授权
  getUserInfo(res) {
    console.log(res)
    if (res.detail.rawData) {
      this.setData({
        userInfo: res.detail.userInfo
      })
      //将用户信息存到缓存
      wx.setStorage({
        key: 'userInfo',
        data: res.detail.userInfo,
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
  //获取用户评论内容
  getVal(e){
    console.log(e)
    this.setData({
      val:e.detail.value
    })
  },
  //评论
  comment(){
    console.log(this.data.val)
    //先判断用户是否授权
    wx.getStorage({
      key: 'userInfo',
      success:(res)=>{
        this.setData({
          userInfo: true
        })
        if (!this.data.val) {
          wx.showToast({
            title: '请输入内容后再评论哦！',
            icon: 'none'
          })
        } else {
          wx.request({
            url: api.comment2(app.globalData.openid, this.data.val, this.data.id),
            success: (res) => {
              console.log(res)
              if(res.data.re.status==3){
                wx.showToast({
                  title: '您评论的内容涉及敏感词汇,请重新输入',
                  icon: 'none'
                })
              }else{
                this.setData({
                  val: ''
                })
                wx.showToast({
                  title: '评论成功',
                  success: () => {
                    //刷新评论列表
                    wx.request({
                      url: api.commentList2(this.data.id),
                      success: (res) => {
                        console.log(res)
                        this.setData({
                          commentList: res.data.re,
                          num: res.data.re.length
                        })
                      }
                    })
                  }
                })
              }
         
            }
          })
        }
      },
      fail:res=>{
        this.setData({
          userInfo: false
        })
      }
    })

  },
  //点赞
  zan(){
    wx.request({
      url: api.like2(app.globalData.openid,this.data.id),
      success:(res)=>{
        console.log(res)
        //点赞成功改变点赞按钮样式
        if(res.data.status==1){
          //点赞成功
          wx.showToast({
            title: res.data.msg,
          })
          wx.setStorage({
            key: this.data.info.id,
            data: true,
          })
        }else if(res.data.status==0){
          //取消点赞
          wx.showToast({
            title: res.data.msg,
          })
          wx.setStorage({
            key: this.data.info.id,
            data: false,
          })
        }else{
          wx.showToast({
            title: '啊哦，发生了一个未知错误',
            icon:'none'
          })
        }
        //更新点赞icon显示
        wx.getStorage({
          key: this.data.info.id,
          success: (res) => {
            console.log(res)
            if (res.data) {
              this.setData({
                iszan: true
              })
            } else {
              this.setData({
                iszan: false
              })
            }
          },
        })
        //点赞成功&&取消点赞刷新点赞人数
        wx.request({
          url: api.getZan(this.data.id),
          success:(res)=>{
            console.log(res)
            this.setData({
              zan:res.data.re.zan
            })
          }
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
    //获取详情
    wx.request({
      url: api.getSlqj(this.data.id, app.globalData.openid),
      // url:'https://syb.shimokeji.cn/index.php/Api/index/eduDetail?id='+this.data.id+'&admin_id=15&openid=o_wP74n6nmiTlMPpb3eaySBzoFKg',
      success: (res) => {
        console.log(res)
        this.setData({
          info: res.data.data.re,
          zan: res.data.data.re.zan
        })
        wx.getStorage({
          key: this.data.info.id,
          success:(res)=>{
            console.log(res)
            if(res.data){
              this.setData({
                iszan:true
              })
            }else{
              this.setData({
                iszan:false
              })
            }
          },
        })
      },      
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