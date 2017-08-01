// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '最新话题',
    chooseAddr: {
      province: { name: "" },
      city: { name: "" },
      detail: "",
    },
    selected: 'wechat',
    address: "",
    tradeMethodIndex: 0,
    tradeMethod: ["邮寄", "上门自取"],
    expressFeeMethodList: [
      { "id": "wechat", "name": "微信支付" },
      { "id": "balance", "name": "余额支付" }
      ]
  },
  goMyAddr: function (e) {
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../myAddr/myAddr?id=' + id;

    wx.navigateTo({
      url: url
    })
  },
  bindChange: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      selected: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tradeMethodIndex: e.detail.value
    })
  },
  getOrderInfo: function ( callback) {

  var book_user_id = this.data.book_user_id
  var user_book_id =  this.data.user_book_id;


    var callback = callback;
    var that = this;
    var params = {}
    if (book_user_id>0) {
      params["book_user_id"] = book_user_id
    }
    if (user_book_id > 0) {
      params["user_book_id"] = user_book_id
    }
    wx.request({
      url: getApp().config.host + '/preview_order',
      data: params,
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        if (res.data.data.addr_info) {
          that.setData({

          chooseAddr: res.data.data.addr_info
          })
        }
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
  refresh: function() {
    this.getOrderInfo();
  },
  onLoad: function (options) {
    console.log(options);
    wx.showNavigationBarLoading();
    var book_user_id = options.book_user_id
    var user_book_id = options.user_book_id
    this.setData({
      book_user_id: book_user_id,
      user_book_id: user_book_id
    })


    this.getOrderInfo( function () {
      wx.hideNavigationBarLoading();

    });
  },
  startPay: function () {
    var that = this;
    var goSuccess = function () {
      wx.redirectTo({
        url: '/pages/paySuccess/paySuccess?id=1'
      })
    }


    var name = this.data.chooseAddr.name
    var phone = this.data.chooseAddr.phone
    var lnglat = this.data.chooseAddr.city.lnglat;
    var addr = this.data.chooseAddr.province.name + this.data.chooseAddr.city.name + this.data.chooseAddr.detail;
    var book_ids = getApp().getIdList(this.data.data.book_list);
    var data = {
      book_ids: book_ids.join(","),
      express_fee: this.data.data.express_fee,
      book_fee: this.data.data.book_fee,
      trade_cat: parseInt(this.data.tradeMethodIndex||0)+1,
      pay_express_method: this.data.selected,
      address: addr,
      addr_id: that.data.chooseAddr.id,
      lnglat: lnglat,
      name: name,
      phone:phone

    }
    data["openid"] = getApp().globalData.openid;
    wx.request({
      url: getApp().config.host + '/start_pay',
      method: 'POST',
      data: data,
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
        if (that.data.selected == "balance" || parseInt(that.data.tradeMethodIndex || 0) + 1==2) {
          wx.showToast({
            title: res.data.msg,
            icon: 'error',
            duration: 1000
          })
          goSuccess()
          return
        }
        that.order_no = res.data.data.order_no;
        wx.requestPayment(
          {
            'timeStamp': res.data.data.timestamp,
            'nonceStr': res.data.data.nonce,
            'package': res.data.data.package,
            'signType': 'MD5',
            'paySign': res.data.data.pay_sign,
            'success': function (res) {
              console.log(res.errMsg)
              if (res.errMsg == "requestPayment:ok") {
                goSuccess();
              }

            },
            'fail': function (res) {
              console.log(res, "fail")
              wx.request({
                url: getApp().config.host + '/cancel_order_before_pay',
                method: 'POST',
                data: { order_no: that.order_no },
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
                    title: "取消支付",
                    icon: 'success',
                    duration: 1000
                  })
                },
              })
            },
            'complete': function (res) {
              console.log(res.errMsg)
              if (res.errMsg == "requestPayment:ok") {
                goSuccess();
              }

            }
          })
      },
      complete: function () {

      }
    });
  },
  goChooseBookList: function (e) {
    var bookIds = e.currentTarget.dataset.books;
    var url ="";

    if (this.data.book_user_id > 0) {
      url = '../chooseBookList/chooseBookList?edit=1&user_book_ids=' + bookIds;

    } else {
      url = '../chooseBookList/chooseBookList?user_book_ids=' + bookIds;
    }

    wx.navigateTo({
      url: url
    })
  }

})