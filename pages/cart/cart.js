// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    groupList: []
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
        callback();
      }
    });
  },
  onLoad: function (options) {
    console.log(options);
    this.getCartInfo(options.id);
  },
  onPullDownRefresh: function () {
    console.log("下拉刷新");
    var that = this;
    wx.stopPullDownRefresh();


    wx.showNavigationBarLoading()

    that.getCartInfo(function () {
      wx.hideNavigationBarLoading();   
      wx.stopPullDownRefresh({
        complete: function (res) {

          console.log(res, new Date())
        }
      })  
    })

  },
  stopPullDownRefresh: function () {

   
  },
})