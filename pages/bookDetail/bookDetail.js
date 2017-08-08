// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '书本详情',
    cartCount: 0,
    currentTab: 0,
    toastShow: true,
    scroll: 'auto',
    book: {},
  },
  goBookLocation: function() {
     wx.openLocation({
       latitude: Number(this.data.book.lat),
       longitude: Number(this.data.book.lng),
       address: this.data.book.address,
       name: this.data.book.address_name,
          scale: 28
        })
  },
  fetchDetail: function (id) {
    var params = {};
    var longitude = getApp().globalData.longitude;
    var latitude = getApp().globalData.latitude;
    if (longitude && latitude) {
      params["lnglat"] = longitude + "," + latitude
    }
    var that = this;
    getApp().doRequest({
      url: getApp().config.host +"/book_detail?book_id=" + id,
      method: "GET",
      data: params,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        that.setData({
          book: res.data.data,
          cartCount: res.data.data.cart_count
        })
        wx.setNavigationBarTitle({
          title: res.data.data.title || ""
        })
      }
    })
    that.fetchReplies(id);
  },
  fetchReplies: function (id) {
    //http://www.webhek.com/post/css-100-percent-height.html
    //块级元素
  },
  onPreviewImage: function (e) {
    var that=this
    console.log(e.currentTarget.id);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.book.image_list// 需要预览的图片http链接列表
    })
  },
  clickTab: function (e) {
    console.log(e.currentTarget.dataset.current)
    var that = this;
    that.setData({ currentTab: e.currentTarget.dataset.current });

  },
  touchDesc : function () {
    console.log("start touch,,,")
    this.setData({
    //  scroll:"hidden"
    })
  },
  onLoad: function (options) {
    console.log(options);
    this.fetchDetail(options.id);
  },
  goCart: function (e) {

    if (this.data.cartCount== 0) {
      wx.showToast({
        title: "购物车空的",
        icon: 'error',
        duration: 1000
      })
      return
    }
    var id = e.currentTarget.id;
    console.log(id);
    var url = '../cart/cart';


    wx.navigateTo({
      url: url
    })
  },
  buyNow: function(e) {
    var url = '../orderPreview/orderPreview?user_book_id=' + this.data.book.id;

    wx.navigateTo({
      url: url
    })
    return
  },
  toastHide: function (event) {
    this.setData({ toastShow: true })
  },
  addToCart: function(e) {
    var that=this;
    var data = {

      "user_book_id":this.data.book.id
    }
    if (this.data.book.in_cart) {
      data["status"] = 0
    }
    getApp().doRequest({
      url: getApp().config.host + '/add_to_cart',
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {

          that.setData({
            "message": res.data.msg,
            "cartCount": res.data.data.cart_count,
            "toastShow": false,
            "book.in_cart": (data["status"]==0)==false

          })
      }
    });
  }
})
