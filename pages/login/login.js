var Util = require('../../utils/md5.js');

Page({
  data: {
    amount: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {

      }
    });
    this.setData({
      balance: getApp().globalData.balance
    })
  },
  goReset: function(e) {
    var url = '../reset/reset';

    wx.redirectTo({
      url: url
    })
  },
  goRegister: function (e) {

    var url = '../register/register';

    wx.redirectTo({
      url: url
    })
  },
  onLogin: function (e) {
    var that = this;
    var params = {};
    params["cellphone"] = e.detail.value.cellphone;
    params["password"] = Util.hexMD5( e.detail.value.password) ;

    wx.request({
      url: getApp().config.host + "/login",
      data: params,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          })
          return
        }
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1000
        })
    
        wx.setStorageSync('user', res.data.data);//存储openid    
        getApp().globalData.userInfo = res.data.data
        wx.navigateBack({

        })




      }
    })
  },
});