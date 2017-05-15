// topicList.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '添加图书',
    book: {},
    hidden: false
  },
  // 事件处理函数
  onTabAdd: function (e) {
    var that = this;

    wx.scanCode({
      success: (res) => {
        console.log(res);
        if (res.result.length == "") {
          alter("获取不到isbn");
          return
        }
        console.log(res.result);
        console.log(res.scanType);
        var bookIsbn = res.result;
        wx.request({
          url: 'https://api.douban.com/v2/book/isbn/' + bookIsbn,
          method: 'GET',
          success: function (res) {

            console.log(res);
            console.log('https://api.douban.com/v2/book/isbn/' + bookIsbn)
            if (res.data.code && res.data.code > 0) {
              console.log(res.data.msg);
              return;
            }
            console.log(res.data.title);
            that.setData({
              book: res.data
            })

          }

        })
      }})
  },
  fetchData: function (id) {
    
  },
  onLoad: function (options) {
    this.fetchData(options.id);
  }
})
