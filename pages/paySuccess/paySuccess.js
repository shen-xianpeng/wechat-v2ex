// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '',

  },
  onLoad: function() {
    
  },
  goIndex: function () {
    wx.redirectTo({
      url: '/pages/bookList/bookList'
    })
  },
  goOrder: function () {
    wx.redirectTo({
      url: '/pages/myBookList/myBookList'
    })
  }

})