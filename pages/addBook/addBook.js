// topicList.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '添加图书',
    book: {},
    hidden: false,
    showSuccessModal: false,
    showErrorModal: false,
    errMsg: ""
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
          url: 'https://www.xianpeng.org/add_book_by_barcode',
          data: params,
          method: 'GET',
          success: function (res) {
            console.log(res);
            if (res.data.code && res.data.code > 0) {
              console.log(res.data.msg);
              that.setData({
                showErrorModal: true,
                errMsg: res.data.msg
              })
              return;
            }
            that.setData({
              book: res.data
            })
            that.book_id = res.data.id;
            that.setData({
              showSuccessModal: true
            })

          },
          fail: function( res) {
            that.setData({
              showErrorModal: true
            })
            console.log(res);
          }

        })
      }})
  },
  fetchData: function (id) {
    
  },
  onCancelModal: function(){
    this.setData({
      showSuccessModal: false
    })
  },
  onConfirmModal: function () {
    this.setData({
      showSuccessModal: false
    })
    var url = '../bookDetail/bookDetail?id=' + this.book_id;

    wx.navigateTo({
      url: url
    })
    return
    this.setData({
      showSuccessModal: false
    })
    wx.switchTab({
      url: '../bookList/bookList',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  onErrorConfirmModal: function () {
    this.setData({
      showErrorModal: false
    })
  },
  onLoad: function (options) {
    this.fetchData(options.id);
  
  }
})
