// latest.js
var Api = require('../../utils/api.js');

Page({
  data: {
    title: '最新话题',
    latest: [],
    datalist: [],
    hidden: false,
    scrollTop: 0,
    scrollHeight: 0  
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight
        });
        that.fetchData();

      }
    });
  },  
  bindDownLoad: function () {
  },
  scroll: function (event) {
  },
  refresh: function (event) {

  },
  // 事件处理函数
  redictDetail: function(e) {
    var id = e.currentTarget.id,
      url = '../detail/detail?id=' + id;
      
    wx.navigateTo({
      url: url
    })
  },
  fetchData: function() {
    var that = this;
    wx.request({
      url: "http://118.184.11.37:10000/book_list",
      success: function(res) {
        console.log(res)
        setTimeout(function() {
          that.setData({
            hidden: true,
            datalist: res.data.infos
          })
        }, 100)
      }
    })
  },
 onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },
  onReachBottom: function () {
    console.log("上拉");
  }
})