// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '',

  },
  onLoad: function() {
    
  },
  goIndex: function () {
    wx.reLaunch({
      url: '/pages/bookList/bookList'
    })
  },
  goOrder: function () {
    wx.navigateTo({
      url: '/pages/myBookList/myBookList'
    })
  }

})