// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '书本详情',
    currentTab: 0,
    toastShow: true,
    scroll: 'auto',
    book: {},
  },
  fetchDetail: function (id) {
    var that = this;
    wx.request({
      url: getApp().config.host +"/book_detail?book_id=" + id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "token": getApp().globalData.userInfo.token
      },
      success: function (res) {
        that.setData({
          book: res.data.data
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
    wx.request({
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
            "toastShow": false,
            "book.in_cart": (data["status"]==0)==false

          })
      }
    });
  }
})
