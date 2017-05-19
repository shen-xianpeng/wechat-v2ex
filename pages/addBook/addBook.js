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
        var params = {};
        params["barcode"] = bookIsbn;
        params["code_type"] = res.scanType;
        console.log("start")
        wx.request({
          url: 'http://118.184.11.37:10000/add_book_by_barcode',
          data: params,
          method: 'GET',
          success: function (res) {
            console.log(res);
            if (res.data.code && res.data.code > 0) {
              console.log(res.data.msg);
              return;
            }
            that.setData({
              book: res.data
            })

          },
          fail: function( res) {
            console.log(res);
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
