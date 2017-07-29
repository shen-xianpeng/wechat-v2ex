var Util = require('../../utils/md5.js');





Page({
  data: {
    amount: 0,
    sending: false,
    countdown: 0,
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
  clickSend: function() {
    var that= this;
    this.setData(
      {
        sending: true
      }
    )

    this.sendSms(
      function () {
        that.data.countdown = 61;
        that._clickSend();
      }
    )

 
  },
  _clickSend: function () {

    var that=this;
    if (this.data.countdown == 0) {
    } else {
      this.data.countdown--
      this.setData(
        {
          countdown: this.data.countdown
        }
      )
      setTimeout(function () {
        that._clickSend()
      },
        1000)
    }
  },
  goLogin: function (e) {

    var url = '../login/login';

    wx.redirectTo({
      url: url
    })
  },
  onInputCellphone: function(e) {
    console.log(e)
    this.data.cellphone=e.detail.value;

  },
  sendSms: function(callback) {
    var that= this;
    var params = {};
    params["cellphone"] = this.data.cellphone;
    params["code_type"] = "reset";

    wx.request({
      url: getApp().config.host + "/send_sms_code",
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
        if (callback) {
          callback();
        }
      },
      complete: function() {
        that.setData(
          {
            sending: false
          }
        )
      }
    });
  },
  onRegister: function (e) {
    var that = this;
    var params = {};
    params["cellphone"] = e.detail.value.cellphone;
    params["password"] = Util.hexMD5(e.detail.value.password);
    params["vcode"] = e.detail.value.vcode;

    wx.request({
      url: getApp().config.host + "/reset_password",
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