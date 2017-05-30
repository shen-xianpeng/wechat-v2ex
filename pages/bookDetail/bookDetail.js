// detail.js
var Util = require('../../utils/util.js');
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '书本详情',
    currentTab: 0,
    book: {},
  },
  fetchDetail: function (id) {
    var that = this;
    wx.request({
      url: "https://www.xianpeng.org/book_detail?book_id=" + id,
      success: function (res) {
        that.setData({
          book: res.data.data
        })
        wx.setNavigationBarTitle({
          title: res.data.data.title
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
    console.log(e.currentTarget.id);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.id] // 需要预览的图片http链接列表
    })
  },
  clickTab: function (e) {
    console.log(e.currentTarget.dataset.current)
    var that = this;
    that.setData({ currentTab: e.currentTarget.dataset.current });

  },
  onLoad: function (options) {
    console.log(options);
    this.fetchDetail(options.id);
  }
})
