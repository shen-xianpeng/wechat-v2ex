// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '最新话题',
    tradeMethod: ["邮寄", "上门取货"],
    expressFeeMethodList: [
      "使用余额支付", "使用微信支付"]
  },
  getOrderInfo: function (book_user_id, callback) {
    var callback = callback;
    var that = this;
    wx.request({
      url: getApp().config.host + '/preview_order?book_user_id='+book_user_id,

      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        that.setData({
          data: res.data.data
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
    var book_user_id = options.book_user_id
    this.getOrderInfo(book_user_id, function () {
      wx.hideNavigationBarLoading();

    });
  }


})