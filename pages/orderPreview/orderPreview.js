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
  },
  startPay: function (){
    wx.request({
      url: getApp().config.host + '/start_pay',
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        console.log(res)
        /**ata
:
{trade_type: "JSAPI", prepay_id: "wx2017070322195225095197dc0037139688", nonce_str: "JtAaL0U4MjwlLC6F",…}
appid
:
"wxe0c65ea23e49fc75"
device_info
:
"WEB"
mch_id
:
"1483847012"
nonce_str
:
"JtAaL0U4MjwlLC6F"
prepay_id
:
"wx2017070322195225095197dc0037139688"
result_code
:
"SUCCESS"
return_code
:
"SUCCESS"
return_msg
:
"OK"
sign
:
"5AD5FD65D0DFCD8E3B4EEF61E8011B88"
trade_type
:
"JSAPI"
msg
:
"" */
        wx.requestPayment(
          {
            'timeStamp': res.data.data.timestamp,
            'nonceStr': res.data.data.nonce,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.pay_sign,
            'success': function (res) {
              console.log(res,"success");
              wx.reLaunch({
                url: '/pages/paySuccess/paySuccess?id=1'
              })
             },
            'fail': function (res) { 
              console.log(res);

            },
            'complete': function (res) { 
              console.log(res, "complete");

            }
          })
      },
      complete: function () {
   
      }
    });
  }

})