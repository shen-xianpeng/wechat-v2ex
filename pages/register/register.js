
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
  goLogin: function (e) {

    var url = '../login/login';

    wx.navigateTo({
      url: url
    })
  },
  register: function () {
    var that = this;
    var params = {};

    wx.request({
      url: getApp().config.host + "/withdraw_money",
      data: params,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
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
        wx.navigateBack({

        })




      }
    })
  },
});