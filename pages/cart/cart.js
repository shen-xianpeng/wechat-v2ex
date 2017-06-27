// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    groupList: []
  },
  getCartInfo: function (e) {
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
      }
    });
  },
  onLoad: function (options) {
    console.log(options);
    this.getCartInfo(options.id);
  },
})