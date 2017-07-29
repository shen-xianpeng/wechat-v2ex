// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '',

  },
  onLoad: function(options) {
      this.data.book_id = options.book_id
  },
  goIndex: function () {
    wx.switchTab({
      url: '/pages/bookList/bookList'
    })
  },
  goBookDetail: function () {
    wx.redirectTo({
      url: '/pages/bookDetail/bookDetail?book_id='+this.data.book_id
    })
  }

})