// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    groupList: [],
    activeHoverIndex: undefined
  },
  getCartInfo: function (callback) {
    var callback = callback;
    var that = this;
    wx.request({
      url: getApp().config.host + '/cart_item_list',

      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        that.setData({
          groupList: res.data.data
        })
      },
      complete: function () {
        if (callback) {
          callback();
        }
      }
    });
  },
  onLoad: function (options) {
    console.log(options);
    wx.showNavigationBarLoading();   

    this.getCartInfo(function() {
      wx.hideNavigationBarLoading();   

    });
  },
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    var that = this;
    wx.stopPullDownRefresh();



    that.getCartInfo(function () {
      wx.stopPullDownRefresh({
        complete: function (res) {

          console.log(res, new Date())
        }
      })  
    })

  },
  stopPullDownRefresh: function () {

   
  },
  touchStartElement: function (e) {
    console.log("start", e);
    var id = e.currentTarget.id;
    this.setData({
      activeHoverIndex: id

    })
  },
  touchEndElement: function (e) {
    console.log("end", e);

    var that = this;
    setTimeout(function () {
      that.setData({
        //warnning undefined==""=="0"==0
        activeHoverIndex: "none"

      })
    }, 500)

  },
  touchMoveElement: function (e) {
    console.log("move", e);

    this.setData({
      activeHoverIndex: "none"

    })
  },
  goOrderPreview: function(e) {
    var url = '../orderPreview/orderPreview?book_user_id=' + e.currentTarget.dataset.userid;

    wx.navigateTo({
      url: url
    })
  },
  goCartBookList: function (e) {
    var url = '../cartBookList/cartBookList?book_user_id=' + e.currentTarget.dataset.userid;

    wx.navigateTo({
      url: url
    })
  }
  
})