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
    tradeMethod: ["邮寄", "上门取货"],
    expressFeeMethodList: [
      { "id": "wechat", "name": "使用微信支付" },
      { "id": "balance", "name": "使用余额支付" }
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
  getOrderInfo: function (orderNo, callback) {
     var that = this;
    var params = {
      order_no: orderNo
    }
 
    wx.request({
      url: getApp().config.host + '/order_detail',
      data: params,
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        res.data.data.book_ids = res.data.data.book_id_list.join(",") 
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
    var orderNo = options.order_no
    this.data.orderNo = orderNo;
    this.getOrderInfo(orderNo, function () {
      wx.hideNavigationBarLoading();

    });
  },
  goChooseBookList: function (e) {
    var bookIds = e.currentTarget.dataset.books;
    var url = '../chooseBookList/chooseBookList?user_book_ids=' + bookIds;

    wx.navigateTo({
      url: url
    })
  },
  onCancel: function (e) {
    var that = this;
    var order_no = e.currentTarget.dataset.order;
    console.log(order_no);

    var params = {}
    params["order_no"] = order_no
    wx.request({
      method: 'POST',
      url: getApp().config.host + "/cancel_order_after_pay",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      data: params,
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
        that.getOrderInfo(that.data.orderNo, function () {

        });
      }
    });

  },
  onConfirmReceive: function (e) {
    var that = this;
    var order_no = e.currentTarget.dataset.order;
    console.log(order_no);

    var params = {}
    params["order_no"] = order_no
    wx.request({
      method: 'POST',
      url: getApp().config.host + "/confirm_receive",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      data: params,
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
        that.getOrderInfo(that.data.orderNo, function () {

        });
      }
    });

  },
  onConfirmDelivery: function (e) {
    var that = this;
    var order_no = e.currentTarget.dataset.order;
    console.log(order_no);

    var params = {}
    params["order_no"] = order_no
    wx.request({
      method: 'POST',
      url: getApp().config.host + "/confirm_delivery",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      data: params,
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

        that.getOrderInfo(that.data.orderNo, function () {

        });
      }
    });

  },


})